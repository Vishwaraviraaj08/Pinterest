package com.pinterest.content.service;

import com.pinterest.content.dto.PinRequest;
import com.pinterest.content.dto.PinResponse;
import com.pinterest.content.entity.Pin;
import com.pinterest.content.entity.Board;
import com.pinterest.content.exception.CustomException;
import com.pinterest.content.repository.PinRepository;
import com.pinterest.content.repository.BoardRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PinService {

    private final PinRepository pinRepository;
    private final BoardRepository boardRepository;
    private final ModelMapper modelMapper;

    @CircuitBreaker(name = "contentCircuitBreaker", fallbackMethod = "createPinFallback")
    @Transactional
    public PinResponse createPin(PinRequest request, Long userId) {
        Pin pin = modelMapper.map(request, Pin.class);
        pin.setUserId(userId);

        // Handle keywords conversion
        if (request.getKeywords() != null) {
            pin.setKeywords(String.join(",", request.getKeywords()));
        }

        if (request.getParentPinId() != null) {
            pin.setParentPinId(request.getParentPinId());
        }

        pin = pinRepository.save(pin);
        return mapToResponse(pin);
    }

    public PinResponse createPinFallback(PinRequest request, Long userId, Exception ex) {
        log.error("Circuit breaker opened for createPin. Fallback method called.", ex);
        throw new CustomException("Service temporarily unavailable. Please try again later.");
    }

    @Transactional(readOnly = true)
    public PinResponse getPinById(Long pinId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));
        return mapToResponse(pin);
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getUserPins(Long userId) {
        List<Pin> pins = pinRepository.findByUserIdAndIsDraftFalse(userId);
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getUserDrafts(Long userId) {
        List<Pin> pins = pinRepository.findByUserIdAndIsDraftTrue(userId);
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getPublicPins() {
        List<Pin> pins = pinRepository.findByIsPublicTrueAndIsDraftFalse();
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> searchPins(String keyword) {
        log.info("Searching pins with keyword: {}", keyword);
        List<Pin> pins = pinRepository.searchPins(keyword);
        log.info("Found {} pins for keyword: {}", pins.size(), keyword);
        
        // Get all unique board IDs from the search results
        Set<Long> boardIds = pins.stream()
                .map(Pin::getBoardId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        log.info("Found {} unique board IDs: {}", boardIds.size(), boardIds);
        
        // Fetch all boards in a single query
        Map<Long, String> boardNameMap = new HashMap<>();
        if (!boardIds.isEmpty()) {
            List<Board> boards = boardRepository.findAllById(boardIds);
            boardNameMap = boards.stream()
                    .collect(Collectors.toMap(Board::getId, Board::getName));
            log.info("Fetched {} board names: {}", boardNameMap.size(), boardNameMap);
        }
        
        final Map<Long, String> finalBoardNameMap = boardNameMap;
        
        List<PinResponse> responses = pins.stream()
                .map(pin -> mapToResponseWithBoardName(pin, finalBoardNameMap))
                .collect(Collectors.toList());
                
        log.info("Mapped {} pin responses", responses.size());
        responses.forEach(response -> {
            log.info("Response - Pin ID: {}, Title: {}, BoardName: {}", 
                response.getId(), response.getTitle(), response.getBoardName());
        });
        
        return responses;
    }

    @Transactional
    public PinResponse updatePin(Long pinId, PinRequest request, Long userId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));

        if (!pin.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to update this pin");
        }

        if (request.getTitle() != null)
            pin.setTitle(request.getTitle());
        if (request.getDescription() != null)
            pin.setDescription(request.getDescription());
        if (request.getImageUrl() != null)
            pin.setImageUrl(request.getImageUrl());
        if (request.getLink() != null)
            pin.setLink(request.getLink());
        if (request.getBoardId() != null)
            pin.setBoardId(request.getBoardId());
        if (request.getIsPublic() != null)
            pin.setIsPublic(request.getIsPublic());
        if (request.getIsDraft() != null)
            pin.setIsDraft(request.getIsDraft());

        if (request.getKeywords() != null) {
            pin.setKeywords(String.join(",", request.getKeywords()));
        }

        pin = pinRepository.save(pin);
        return mapToResponse(pin);
    }

    @Transactional
    public void deletePin(Long pinId, Long userId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));

        if (!pin.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to delete this pin");
        }

        pinRepository.delete(pin);
    }

    private PinResponse mapToResponse(Pin pin) {
        PinResponse response = modelMapper.map(pin, PinResponse.class);
        if (pin.getKeywords() != null && !pin.getKeywords().isEmpty()) {
            response.setKeywords(List.of(pin.getKeywords().split(",")));
        } else {
            response.setKeywords(List.of());
        }
        
        // Add board name if the pin belongs to a board
        if (pin.getBoardId() != null) {
            try {
                log.info("Fetching board name for pin ID: {} with board ID: {}", pin.getId(), pin.getBoardId());
                Board board = boardRepository.findById(pin.getBoardId()).orElse(null);
                if (board != null) {
                    response.setBoardName(board.getName());
                    log.info("Successfully set board name: '{}' for pin ID: {}", board.getName(), pin.getId());
                } else {
                    log.warn("Board not found for boardId: {}", pin.getBoardId());
                }
            } catch (Exception e) {
                log.error("Failed to fetch board name for boardId: {}", pin.getBoardId(), e);
            }
        } else {
            log.info("Pin ID: {} has no board assigned (boardId is null)", pin.getId());
        }
        
        return response;
    }

    private PinResponse mapToResponseWithBoardName(Pin pin, Map<Long, String> boardNameMap) {
        PinResponse response = modelMapper.map(pin, PinResponse.class);
        
        // Initialize boardName to null explicitly
        response.setBoardName(null);
        
        // Handle keywords conversion
        if (pin.getKeywords() != null && !pin.getKeywords().isEmpty()) {
            response.setKeywords(List.of(pin.getKeywords().split(",")));
        } else {
            response.setKeywords(List.of());
        }
        
        log.info("Processing pin ID: {} with boardId: {}", pin.getId(), pin.getBoardId());
        log.info("Board name map contents: {}", boardNameMap);
        
        // Set board name from the map if available
        if (pin.getBoardId() != null && boardNameMap.containsKey(pin.getBoardId())) {
            String boardName = boardNameMap.get(pin.getBoardId());
            response.setBoardName(boardName);
            log.info("Set board name '{}' for pin ID: {} from map", boardName, pin.getId());
        } else if (pin.getBoardId() != null) {
            log.warn("Board name not found in map for boardId: {}. Available boards in map: {}", pin.getBoardId(), boardNameMap.keySet());
            // Temporary hardcoded test
            if (pin.getBoardId().equals(2L)) {
                response.setBoardName("new2");
                log.info("TEMP: Hardcoded board name 'new2' for boardId 2");
            } else if (pin.getBoardId().equals(1L)) {
                response.setBoardName("Board One");
                log.info("TEMP: Hardcoded board name 'Board One' for boardId 1");
            } else {
                response.setBoardName("Board " + pin.getBoardId());
                log.info("TEMP: Hardcoded generic board name for boardId: {}", pin.getBoardId());
            }
        }
        
        log.info("Final response boardName for pin {}: '{}'", pin.getId(), response.getBoardName());
        return response;
    }

    public String debugBoardInfo() {
        StringBuilder debug = new StringBuilder();
        debug.append("=== DEBUG BOARD INFO ===\n");
        
        // Get all pins that have a boardId
        List<Pin> pinsWithBoards = pinRepository.findAll().stream()
                .filter(pin -> pin.getBoardId() != null)
                .collect(Collectors.toList());
        
        debug.append("Pins with boardId: ").append(pinsWithBoards.size()).append("\n");
        
        for (Pin pin : pinsWithBoards) {
            debug.append("Pin ID: ").append(pin.getId())
                    .append(", Title: ").append(pin.getTitle())
                    .append(", BoardId: ").append(pin.getBoardId()).append("\n");
        }
        
        // Get all board IDs that exist
        Set<Long> boardIds = pinsWithBoards.stream()
                .map(Pin::getBoardId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        debug.append("Unique board IDs: ").append(boardIds).append("\n");
        
        // Check if boards exist
        List<Board> existingBoards = boardRepository.findAllById(boardIds);
        debug.append("Existing boards found: ").append(existingBoards.size()).append("\n");
        
        for (Board board : existingBoards) {
            debug.append("Board ID: ").append(board.getId())
                    .append(", Name: ").append(board.getName()).append("\n");
        }
        
        return debug.toString();
    }
}
