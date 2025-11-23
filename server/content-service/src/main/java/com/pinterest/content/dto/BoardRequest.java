package com.pinterest.content.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {
    @NotBlank(message = "Please provide a valid board name")
    private String name;

    private String description;

    private Boolean isPrivate = false;
}




