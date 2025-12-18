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
@Table(name = "boards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "is_private")
    private Boolean isPrivate = false;

    @Column(name = "board_type")
    private String boardType = "DEFAULT"; 

    @Lob
    @Column(name = "cover_image", columnDefinition = "LONGTEXT")
    private String coverImage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "boards")
    private Set<Pin> pins = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "board_collaborators", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "user_id")
    private Set<Long> collaboratorIds = new HashSet<>();

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
