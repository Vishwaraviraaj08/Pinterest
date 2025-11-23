package com.pinterest.collaboration.controller;

import com.pinterest.collaboration.dto.InvitationRequest;
import com.pinterest.collaboration.dto.InvitationResponse;
import com.pinterest.collaboration.service.InvitationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration/invitations")
@RequiredArgsConstructor
@Tag(name = "Invitation Management", description = "APIs for managing invitations")
public class InvitationController {
    private final InvitationService invitationService;

    @PostMapping
    @Operation(summary = "Create invitation")
    public ResponseEntity<InvitationResponse> createInvitation(
            @Valid @RequestBody InvitationRequest request,
            @RequestHeader("X-User-Id") Long inviterId) {
        InvitationResponse response = invitationService.createInvitation(request, inviterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user invitations")
    public ResponseEntity<List<InvitationResponse>> getInvitations(@PathVariable Long userId) {
        List<InvitationResponse> response = invitationService.getInvitations(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{invitationId}/respond")
    @Operation(summary = "Respond to invitation")
    public ResponseEntity<InvitationResponse> respondToInvitation(
            @PathVariable Long invitationId,
            @RequestParam String response,
            @RequestHeader("X-User-Id") Long userId) {
        InvitationResponse resp = invitationService.respondToInvitation(invitationId, response, userId);
        return ResponseEntity.ok(resp);
    }
}




