package com.pinterest.collaboration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationRequest {
    @NotNull(message = "Please provide a valid invitee ID")
    private Long inviteeId;

    private Long boardId;

    @NotBlank(message = "Please provide a valid invitation type")
    private String invitationType; // BOARD_COLLABORATION, CONNECTION
}




