package com.pinterest.collaboration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionResponse {
    private Long id;
    private Long followerId;
    private Long followingId;
    private LocalDateTime createdAt;
}




