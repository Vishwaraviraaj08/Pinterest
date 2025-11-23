package com.pinterest.content.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PinRequest {
    @NotBlank(message = "Please provide a valid title")
    private String title;

    private String description;

    @NotBlank(message = "Please provide a valid image URL")
    private String imageUrl;

    private String link;

    private Long boardId;

    private Boolean isPublic = true;

    private Boolean isDraft = false;
}




