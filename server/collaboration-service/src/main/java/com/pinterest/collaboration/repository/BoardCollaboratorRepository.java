package com.pinterest.collaboration.repository;

import com.pinterest.collaboration.entity.BoardCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardCollaboratorRepository extends JpaRepository<BoardCollaborator, Long> {
    List<BoardCollaborator> findByBoardId(Long boardId);
    List<BoardCollaborator> findByUserId(Long userId);
    boolean existsByBoardIdAndUserId(Long boardId, Long userId);
}




