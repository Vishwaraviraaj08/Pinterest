package com.pinterest.content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import lombok.EqualsAndHashCode;

@Entity
@Table(name = "pins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Lob
    @Column(name = "image_url", nullable = false, columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String link;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "board_id")
    private Long boardId;

    @ManyToMany
    @JoinTable(name = "boards_pins", joinColumns = @JoinColumn(name = "pin_id"), inverseJoinColumns = @JoinColumn(name = "board_id"))
    private Set<Board> boards = new HashSet<>();

    @Column(name = "parent_pin_id")
    private Long parentPinId;

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
