package com.pinterest.collaboration.service;

import com.pinterest.collaboration.dto.InvitationRequest;
import com.pinterest.collaboration.dto.InvitationResponse;
import com.pinterest.collaboration.entity.Invitation;
import com.pinterest.collaboration.exception.CustomException;
import com.pinterest.collaboration.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.pinterest.collaboration.client.ContentServiceClient;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final ModelMapper modelMapper;
    private final ContentServiceClient contentServiceClient;
    private final ConnectionService connectionService;

    @Transactional
    public InvitationResponse createInvitation(InvitationRequest request, Long inviterId) {
        Invitation invitation = new Invitation();
        invitation.setBoardId(request.getBoardId());
        invitation.setInviteeId(request.getInviteeId());
        invitation.setInvitationType(request.getInvitationType());
        invitation.setInviterId(inviterId);
        invitation.setStatus("PENDING");

        invitation = invitationRepository.save(invitation);
        return modelMapper.map(invitation, InvitationResponse.class);
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> getInvitations(Long userId) {
        List<Invitation> invitations = invitationRepository.findByInviteeIdAndStatus(userId, "PENDING");
        return invitations.stream()
                .map(inv -> modelMapper.map(inv, InvitationResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public InvitationResponse respondToInvitation(Long invitationId, String response, Long userId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new CustomException("Invitation not found"));

        if (!invitation.getInviteeId().equals(userId)) {
            throw new CustomException("You don't have permission to respond to this invitation");
        }

        invitation.setStatus(response);
        invitation = invitationRepository.save(invitation);

        if ("ACCEPTED".equals(response)) {
            if ("BOARD_COLLABORATION".equals(invitation.getInvitationType())) {
                try {
                    contentServiceClient.addCollaborator(invitation.getBoardId(), userId);
                } catch (Exception e) {
                    throw new CustomException("Failed to add collaborator to board: " + e.getMessage());
                }
            } else if ("CONNECTION".equals(invitation.getInvitationType())) {
                // Invitee follows Inviter
                try {
                    connectionService.followUser(userId, invitation.getInviterId());
                } catch (Exception e) {
                    // Ignore if already following
                }
            }
        }

        return modelMapper.map(invitation, InvitationResponse.class);
    }
}
