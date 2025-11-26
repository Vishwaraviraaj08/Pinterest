package com.pinterest.content.controller;

import com.pinterest.content.dto.BoardRequest;
import com.pinterest.content.dto.BoardResponse;
import com.pinterest.content.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/boards")
@RequiredArgsConstructor
@Tag(name = "Board Management", description = "APIs for managing boards")
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    @Operation(summary = "Create a new board")
    public ResponseEntity<BoardResponse> createBoard(
            @Valid @RequestBody BoardRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        BoardResponse response = boardService.createBoard(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "Get board by ID")
    public ResponseEntity<BoardResponse> getBoardById(@PathVariable("boardId") Long boardId) {
        BoardResponse response = boardService.getBoardById(boardId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all boards by user")
    public ResponseEntity<List<BoardResponse>> getUserBoards(@PathVariable("userId") Long userId) {
        List<BoardResponse> response = boardService.getUserBoards(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search boards")
    public ResponseEntity<List<BoardResponse>> searchBoards(@RequestParam("keyword") String keyword) {
        List<BoardResponse> response = boardService.searchBoards(keyword);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{boardId}")
    @Operation(summary = "Update board")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable("boardId") Long boardId,
            @RequestBody BoardRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        BoardResponse response = boardService.updateBoard(boardId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}")
    @Operation(summary = "Delete board")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable("boardId") Long boardId,
            @RequestHeader("X-User-Id") Long userId) {
        boardService.deleteBoard(boardId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{boardId}/pins/{pinId}")
    @Operation(summary = "Add existing pin to board")
    public ResponseEntity<BoardResponse> addPinToBoard(
            @PathVariable("boardId") Long boardId,
            @PathVariable("pinId") Long pinId,
            @RequestHeader("X-User-Id") Long userId) {
        BoardResponse response = boardService.addPinToBoard(boardId, pinId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}/pins/{pinId}")
    @Operation(summary = "Remove pin from board")
    public ResponseEntity<Void> removePinFromBoard(
            @PathVariable("boardId") Long boardId,
            @PathVariable("pinId") Long pinId,
            @RequestHeader("X-User-Id") Long userId) {
        boardService.removePinFromBoard(boardId, pinId, userId);
        return ResponseEntity.noContent().build();
    }
}
