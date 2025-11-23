package com.pinterest.business.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sponsored_pins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SponsoredPin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pin_id", nullable = false)
    private Long pinId;

    @Column(name = "business_id", nullable = false)
    private Long businessId;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}




