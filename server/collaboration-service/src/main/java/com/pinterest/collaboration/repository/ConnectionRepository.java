package com.pinterest.collaboration.repository;

import com.pinterest.collaboration.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByFollowerId(Long followerId);
    List<Connection> findByFollowingId(Long followingId);
    Optional<Connection> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
}




