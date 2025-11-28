package com.pinterest.business.repository;

import com.pinterest.business.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    List<BusinessProfile> findByUserId(Long userId);

    List<BusinessProfile> findAll();

    @org.springframework.data.jpa.repository.Query("SELECT b FROM BusinessProfile b WHERE " +
            "LOWER(b.businessName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<BusinessProfile> searchProfiles(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
