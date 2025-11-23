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

        if (request.getName() != null) board.setName(request.getName());
        if (request.getDescription() != null) board.setDescription(request.getDescription());
        if (request.getIsPrivate() != null) board.setIsPrivate(request.getIsPrivate());

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

    private BoardResponse mapToBoardResponse(Board board) {
        BoardResponse response = modelMapper.map(board, BoardResponse.class);
        List<Pin> pins = pinRepository.findByBoardId(board.getId());
        response.setPinCount(pins.size());
        List<PinResponse> pinResponses = pins.stream()
                .map(pin -> modelMapper.map(pin, PinResponse.class))
                .collect(Collectors.toList());
        response.setPins(pinResponses);
        return response;
    }
}




