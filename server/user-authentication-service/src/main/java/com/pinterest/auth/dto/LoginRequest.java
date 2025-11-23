package com.pinterest.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Please provide a valid password")
    private String password;
}




