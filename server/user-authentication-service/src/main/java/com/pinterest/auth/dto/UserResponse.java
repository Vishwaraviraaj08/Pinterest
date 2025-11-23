package com.pinterest.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private String avatar;
    private String mobileNumber;
    private LocalDateTime createdAt;
}




