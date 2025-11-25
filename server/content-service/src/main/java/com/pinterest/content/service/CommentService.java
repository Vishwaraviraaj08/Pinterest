package com.pinterest.content.service;

import com.pinterest.content.entity.Comment;
import com.pinterest.content.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public Comment createComment(String text, Long pinId, Long userId) {
        Comment comment = new Comment();
        comment.setText(text);
        comment.setPinId(pinId);
        comment.setUserId(userId);
        return commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPinId(Long pinId) {
        return commentRepository.findByPinId(pinId);
    }
}
