package com.pinterest.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {
    @NotBlank(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Please provide a valid mobile number")
    private String mobileNumber;

    @NotBlank(message = "Please provide a valid new password")
    private String newPassword;
}




