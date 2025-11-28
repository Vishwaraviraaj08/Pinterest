package com.pinterest.content.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {
    private Long id;
    private String name;
    private String description;
    private Long userId;
    private Boolean isPrivate;
    private String coverImage;
    private String boardType;
    private Integer pinCount;
    private List<PinResponse> pins;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
