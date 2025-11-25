package com.truthmoment.antifakenews.service;

import com.truthmoment.antifakenews.model.Comment;
import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface CommentService {
    Comment create(Comment comment);
    Optional<Comment> findById(Long id);
    Comment update(Long id, Comment comment);
    void delete(Long id);
    Page<Comment> findByNews(News news, Pageable pageable);
    Page<Comment> findByParent(Comment parent, Pageable pageable);
    Comment like(Long commentId, User user);
    Comment dislike(Long commentId, User user);
    Comment report(Long commentId, String reason);
}
