package com.pinterest.content.controller;

import com.pinterest.content.dto.PinRequest;
import com.pinterest.content.dto.PinResponse;
import com.pinterest.content.service.PinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/pins")
@RequiredArgsConstructor
@Tag(name = "Pin Management", description = "APIs for managing pins")
public class PinController {

    private final PinService pinService;

    @PostMapping
    @Operation(summary = "Create a new pin")
    public ResponseEntity<PinResponse> createPin(
            @Valid @RequestBody PinRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        PinResponse response = pinService.createPin(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{pinId}")
    @Operation(summary = "Get pin by ID")
    public ResponseEntity<PinResponse> getPinById(@PathVariable("pinId") Long pinId) {
        PinResponse response = pinService.getPinById(pinId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all pins by user")
    public ResponseEntity<List<PinResponse>> getUserPins(@PathVariable("userId") Long userId) {
        List<PinResponse> response = pinService.getUserPins(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public")
    @Operation(summary = "Get all public pins")
    public ResponseEntity<List<PinResponse>> getPublicPins() {
        List<PinResponse> response = pinService.getPublicPins();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search pins")
    public ResponseEntity<List<PinResponse>> searchPins(@RequestParam String keyword) {
        List<PinResponse> response = pinService.searchPins(keyword);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{pinId}")
    @Operation(summary = "Update pin")
    public ResponseEntity<PinResponse> updatePin(
            @PathVariable("pinId") Long pinId,
            @RequestBody PinRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        PinResponse response = pinService.updatePin(pinId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pinId}")
    @Operation(summary = "Delete pin")
    public ResponseEntity<Void> deletePin(
            @PathVariable("pinId") Long pinId,
            @RequestHeader("X-User-Id") Long userId) {
        pinService.deletePin(pinId, userId);
        return ResponseEntity.noContent().build();
    }
}
