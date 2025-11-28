package com.pinterest.content.repository;

import com.pinterest.content.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUserId(Long userId);

    List<Board> findByUserIdOrCollaboratorIdsContaining(Long userId, Long collaboratorId);

    @Query("SELECT b FROM Board b WHERE b.isPrivate = false AND " +
            "(b.name LIKE %:keyword% OR b.description LIKE %:keyword%)")
    List<Board> searchBoards(@Param("keyword") String keyword);
}
