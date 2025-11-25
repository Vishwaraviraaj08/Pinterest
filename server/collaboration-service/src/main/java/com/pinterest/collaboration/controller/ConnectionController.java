package com.pinterest.collaboration.controller;

import com.pinterest.collaboration.dto.ConnectionResponse;
import com.pinterest.collaboration.service.ConnectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration/connections")
@RequiredArgsConstructor
@Tag(name = "Connection Management", description = "APIs for managing user connections")
public class ConnectionController {
    private final ConnectionService connectionService;

    @PostMapping("/follow/{followingId}")
    @Operation(summary = "Follow a user")
    public ResponseEntity<ConnectionResponse> followUser(
            @PathVariable("followingId") Long followingId,
            @RequestHeader("X-User-Id") Long followerId) {
        ConnectionResponse response = connectionService.followUser(followerId, followingId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/unfollow/{followingId}")
    @Operation(summary = "Unfollow a user")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable("followingId") Long followingId,
            @RequestHeader("X-User-Id") Long followerId) {
        connectionService.unfollowUser(followerId, followingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers/{userId}")
    @Operation(summary = "Get user followers")
    public ResponseEntity<List<ConnectionResponse>> getFollowers(@PathVariable("userId") Long userId) {
        List<ConnectionResponse> response = connectionService.getFollowers(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/following/{userId}")
    @Operation(summary = "Get users following")
    public ResponseEntity<List<ConnectionResponse>> getFollowing(@PathVariable("userId") Long userId) {
        List<ConnectionResponse> response = connectionService.getFollowing(userId);
        return ResponseEntity.ok(response);
    }
}
