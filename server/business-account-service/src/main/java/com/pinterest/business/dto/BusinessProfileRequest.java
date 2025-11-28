package com.pinterest.business.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileRequest {
    @NotBlank(message = "Please provide a valid business name")
    private String businessName;

    private String description;
    private String website;
    private String logo;
    private String category;
}
