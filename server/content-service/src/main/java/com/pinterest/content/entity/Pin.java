package com.pinterest.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String link;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "board_id")
    private Long boardId;

    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "is_draft")
    private Boolean isDraft = false;

    @Column(name = "is_sponsored")
    private Boolean isSponsored = false;

    @Column(name = "saves_count")
    private Integer savesCount = 0;

    @Column(name = "comments_count")
    private Integer commentsCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}




