package com.pinterest.auth.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Please provide a valid email")
    @Email(message = "Email must be in valid format")
    private String email;

    private String username;

    @NotBlank(message = "Please provide a valid password")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,16}$", message = "Password must contain at least one lowercase, uppercase, digit, and special character")
    private String password;

    @NotBlank(message = "Please provide a valid confirm password")
    private String confirmPassword;

    private String firstName;

    private String lastName;

    private String mobileNumber;
}
