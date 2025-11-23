package com.pinterest.business.controller;

import com.pinterest.business.dto.BusinessProfileRequest;
import com.pinterest.business.dto.BusinessProfileResponse;
import com.pinterest.business.service.BusinessProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/profiles")
@RequiredArgsConstructor
@Tag(name = "Business Profile Management", description = "APIs for managing business profiles")
public class BusinessProfileController {
    private final BusinessProfileService service;

    @PostMapping
    @Operation(summary = "Create business profile")
    public ResponseEntity<BusinessProfileResponse> createProfile(
            @Valid @RequestBody BusinessProfileRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        BusinessProfileResponse response = service.createProfile(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all business profiles")
    public ResponseEntity<List<BusinessProfileResponse>> getAllProfiles() {
        List<BusinessProfileResponse> response = service.getAllProfiles();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{businessId}")
    @Operation(summary = "Get business profile by ID")
    public ResponseEntity<BusinessProfileResponse> getProfile(@PathVariable Long businessId) {
        BusinessProfileResponse response = service.getProfile(businessId);
        return ResponseEntity.ok(response);
    }
}




