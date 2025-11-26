package com.pinterest.content.service;

import com.pinterest.content.dto.BoardRequest;
import com.pinterest.content.dto.BoardResponse;
import com.pinterest.content.dto.PinResponse;
import com.pinterest.content.entity.Board;
import com.pinterest.content.entity.Pin;
import com.pinterest.content.exception.CustomException;
import com.pinterest.content.repository.BoardRepository;
import com.pinterest.content.repository.PinRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final PinRepository pinRepository;
    private final ModelMapper modelMapper;

    @CircuitBreaker(name = "contentCircuitBreaker", fallbackMethod = "createBoardFallback")
    @Transactional
    public BoardResponse createBoard(BoardRequest request, Long userId) {
        Board board = modelMapper.map(request, Board.class);
        board.setUserId(userId);
        board = boardRepository.save(board);
        return mapToBoardResponse(board);
    }

    public BoardResponse createBoardFallback(BoardRequest request, Long userId, Exception ex) {
        log.error("Circuit breaker opened for createBoard. Fallback method called.", ex);
        throw new CustomException("Service temporarily unavailable. Please try again later.");
    }

    @Transactional(readOnly = true)
    public BoardResponse getBoardById(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException("Board not found"));
        return mapToBoardResponse(board);
    }

    @Transactional(readOnly = true)
    public List<BoardResponse> getUserBoards(Long userId) {
        List<Board> boards = boardRepository.findByUserId(userId);
        return boards.stream()
                .map(this::mapToBoardResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BoardResponse> searchBoards(String keyword) {
        List<Board> boards = boardRepository.searchBoards(keyword);
        return boards.stream()
                .map(this::mapToBoardResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest request, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException("Board not found"));

        if (!board.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to update this board");
        }

        if (request.getName() != null)
            board.setName(request.getName());
        if (request.getDescription() != null)
            board.setDescription(request.getDescription());
        if (request.getIsPrivate() != null)
            board.setIsPrivate(request.getIsPrivate());

        board = boardRepository.save(board);
        return mapToBoardResponse(board);
    }

    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException("Board not found"));

        if (!board.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to delete this board");
        }

        boardRepository.delete(board);
    }

    @Transactional
    public BoardResponse addPinToBoard(Long boardId, Long pinId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException("Board not found"));
        
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));
        
        // Check if user has permission to add to this board
        if (!board.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to add pins to this board");
        }
        
        // Check if this pin is already saved to this board
        if (pin.getBoardId() != null && pin.getBoardId().equals(boardId)) {
            throw new CustomException("Pin is already saved to this board");
        }
        
        // Check if a copy of this pin already exists in this board
        if (pinRepository.existsByBoardIdAndParentPinId(boardId, pinId)) {
            throw new CustomException("Pin is already saved to this board");
        }
        
        // For now, use the simple boardId approach instead of many-to-many
        // Set the board ID on the pin if it's not already set to another board
        if (pin.getBoardId() == null) {
            pin.setBoardId(boardId);
            pinRepository.save(pin);
        } else {
            // Create a copy of the pin for this board to avoid conflicts
            Pin newPin = new Pin();
            newPin.setTitle(pin.getTitle());
            newPin.setDescription(pin.getDescription());
            newPin.setImageUrl(pin.getImageUrl());
            newPin.setLink(pin.getLink());
            newPin.setUserId(userId);
            newPin.setBoardId(boardId);
            newPin.setIsPublic(pin.getIsPublic());
            newPin.setIsDraft(false);
            newPin.setIsSponsored(false);
            newPin.setParentPinId(pin.getId());
            newPin.setSavesCount(0);
            newPin.setCommentsCount(0);
            newPin.setKeywords(pin.getKeywords());
            pinRepository.save(newPin);
        }
        
        // Return simple board response without complex relationships
        return getBoardById(boardId);
    }

    @Transactional
    public void removePinFromBoard(Long boardId, Long pinId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException("Board not found"));
        
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));
        
        // Check if user has permission to modify this board
        if (!board.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to remove pins from this board");
        }
        
        // Simple approach: if pin belongs to this board, remove the association
        if (pin.getBoardId() != null && pin.getBoardId().equals(boardId)) {
            pin.setBoardId(null);
            pinRepository.save(pin);
        }
    }

    private BoardResponse mapToBoardResponse(Board board) {
        BoardResponse response = new BoardResponse();
        response.setId(board.getId());
        response.setName(board.getName());
        response.setDescription(board.getDescription());
        response.setUserId(board.getUserId());
        response.setIsPrivate(board.getIsPrivate());
        response.setCoverImage(board.getCoverImage());
        response.setCreatedAt(board.getCreatedAt());
        response.setUpdatedAt(board.getUpdatedAt());
        
        // Use repository to get pins by boardId instead of accessing lazy collection
        List<Pin> pins = pinRepository.findByBoardId(board.getId());
        response.setPinCount(pins.size());
        
        List<PinResponse> pinResponses = pins.stream()
                .map(pin -> {
                    PinResponse pinResponse = new PinResponse();
                    pinResponse.setId(pin.getId());
                    pinResponse.setTitle(pin.getTitle());
                    pinResponse.setDescription(pin.getDescription());
                    pinResponse.setImageUrl(pin.getImageUrl());
                    pinResponse.setLink(pin.getLink());
                    pinResponse.setUserId(pin.getUserId());
                    pinResponse.setBoardId(pin.getBoardId());
                    pinResponse.setIsPublic(pin.getIsPublic());
                    pinResponse.setIsDraft(pin.getIsDraft());
                    pinResponse.setIsSponsored(pin.getIsSponsored());
                    pinResponse.setSavesCount(pin.getSavesCount());
                    pinResponse.setCommentsCount(pin.getCommentsCount());
                    pinResponse.setCreatedAt(pin.getCreatedAt());
                    pinResponse.setUpdatedAt(pin.getUpdatedAt());
                    pinResponse.setParentPinId(pin.getParentPinId());
                    
                    // Handle keywords conversion
                    if (pin.getKeywords() != null && !pin.getKeywords().isEmpty()) {
                        pinResponse.setKeywords(List.of(pin.getKeywords().split(",")));
                    } else {
                        pinResponse.setKeywords(List.of());
                    }
                    return pinResponse;
                })
                .collect(Collectors.toList());
        
        response.setPins(pinResponses);
        return response;
    }
}
