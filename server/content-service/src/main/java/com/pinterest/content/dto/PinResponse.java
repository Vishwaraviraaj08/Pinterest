package com.pinterest.content.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PinResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String link;
    private Long userId;
    private Long boardId;
    private Boolean isPublic;
    private Boolean isDraft;
    private Boolean isSponsored;
    private Integer savesCount;
    private Integer commentsCount;
    private LocalDateTime createdAt;
    private List<String> keywords;
    private LocalDateTime updatedAt;
    private Long parentPinId;
}
