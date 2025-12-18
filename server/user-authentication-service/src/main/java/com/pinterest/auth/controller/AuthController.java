package com.pinterest.auth.controller;

import com.pinterest.auth.dto.*;
import com.pinterest.auth.service.UserService;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration APIs")

public class AuthController {

    private final UserService userService;

    @PostMapping({ "/register", "/register/" })
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("RECEIVED REGISTER REQUEST: " + request);
        AuthResponse response = userService.register(request);
        System.out.println("REGISTRATION SUCCESS: " + response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset user password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        AuthResponse response = userService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{userId}")
    @Operation(summary = "Get user profile")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable("userId") Long userId) {
        UserResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/{userId}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<UserResponse> updateUserProfile(
            @PathVariable("userId") Long userId,
            @RequestBody UserResponse updateRequest) {
        UserResponse response = userService.updateUserProfile(userId, updateRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search users")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam("keyword") String keyword) {
        List<UserResponse> response = userService.searchUsers(keyword);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/batch")
    @Operation(summary = "Get users by IDs")
    public ResponseEntity<List<UserResponse>> getUsersByIds(@RequestBody List<Long> userIds) {
        List<UserResponse> response = userService.getUsersByIds(userIds);
        return ResponseEntity.ok(response);
    }
}
