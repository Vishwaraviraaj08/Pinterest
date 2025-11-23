package com.pinterest.business.repository;

import com.pinterest.business.entity.SponsoredPin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SponsoredPinRepository extends JpaRepository<SponsoredPin, Long> {
    List<SponsoredPin> findByBusinessId(Long businessId);
    List<SponsoredPin> findByCampaignId(Long campaignId);
}




