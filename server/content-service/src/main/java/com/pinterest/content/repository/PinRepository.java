package com.pinterest.content.repository;

import com.pinterest.content.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {
    List<Pin> findByUserId(Long userId);

    List<Pin> findByBoardId(Long boardId);

    List<Pin> findByUserIdAndIsDraftFalse(Long userId);

    List<Pin> findByUserIdAndIsDraftTrue(Long userId);

    @Query("SELECT p FROM Pin p WHERE p.isPublic = true AND p.isDraft = false AND p.parentPinId IS NULL")
    List<Pin> findByIsPublicTrueAndIsDraftFalse();

    @Query("SELECT DISTINCT p FROM Pin p WHERE p.isPublic = true AND p.isDraft = false AND " +
            "(p.title LIKE %:keyword% OR p.description LIKE %:keyword% OR p.keywords LIKE %:keyword%)")
    List<Pin> searchPins(@Param("keyword") String keyword);
}
