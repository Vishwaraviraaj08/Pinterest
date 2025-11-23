package com.pinterest.collaboration.repository;

import com.pinterest.collaboration.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByInviteeIdAndStatus(Long inviteeId, String status);
    List<Invitation> findByInviterId(Long inviterId);
}




