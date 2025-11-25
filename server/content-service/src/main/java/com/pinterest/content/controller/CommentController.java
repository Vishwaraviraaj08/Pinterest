package com.pinterest.content.controller;

import com.pinterest.content.entity.Comment;
import com.pinterest.content.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/comments")
@RequiredArgsConstructor
@Tag(name = "Comment Management", description = "APIs for managing comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "Create a new comment")
    public ResponseEntity<Comment> createComment(
            @RequestBody CommentRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        Comment comment = commentService.createComment(request.getText(), request.getPinId(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/pin/{pinId}")
    @Operation(summary = "Get comments by pin ID")
    public ResponseEntity<List<Comment>> getCommentsByPinId(@PathVariable("pinId") Long pinId) {
        List<Comment> comments = commentService.getCommentsByPinId(pinId);
        return ResponseEntity.ok(comments);
    }

    @Data
    public static class CommentRequest {
        private String text;
        private Long pinId;
    }
}
