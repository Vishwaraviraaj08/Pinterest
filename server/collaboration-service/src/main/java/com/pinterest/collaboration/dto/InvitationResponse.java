package com.pinterest.collaboration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private Long id;
    private Long boardId;
    private Long inviterId;
    private Long inviteeId;
    private String invitationType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}




