package com.pinterest.business.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileResponse {
    private Long id;
    private Long userId;
    private String businessName;
    private String description;
    private String website;
    private String logo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}




