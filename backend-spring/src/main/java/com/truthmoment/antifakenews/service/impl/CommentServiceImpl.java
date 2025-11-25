package com.truthmoment.antifakenews.service.impl;

import com.truthmoment.antifakenews.model.Comment;
import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.repository.CommentRepository;
import com.truthmoment.antifakenews.repository.NewsRepository;
import com.truthmoment.antifakenews.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NewsRepository newsRepository;

    @Override
    @Transactional
    public Comment create(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        
        // Update comments count on news
        News news = savedComment.getNews();
        news.setCommentsCount(news.getCommentsCount() + 1);
        newsRepository.save(news);
        
        return savedComment;
    }

    @Override
    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Comment update(Long id, Comment comment) {
        return commentRepository.findById(id)
                .map(existingComment -> {
                    existingComment.setContent(comment.getContent());
                    return commentRepository.save(existingComment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Update comments count on news
        News news = comment.getNews();
        news.setCommentsCount(Math.max(0, news.getCommentsCount() - 1));
        newsRepository.save(news);
        
        commentRepository.delete(comment);
    }

    @Override
    public Page<Comment> findByNews(News news, Pageable pageable) {
        return commentRepository.findByNews(news, pageable);
    }

    @Override
    public Page<Comment> findByParent(Comment parent, Pageable pageable) {
        return commentRepository.findByParent(parent, pageable);
    }

    @Override
    @Transactional
    public Comment like(Long commentId, User user) {
        // This is a simplified implementation
        // In a real application, you might want to track user likes to prevent double liking
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setLikes(comment.getLikes() + 1);
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Override
    @Transactional
    public Comment dislike(Long commentId, User user) {
        // This is a simplified implementation
        // In a real application, you might want to track user dislikes to prevent double disliking
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setDislikes(comment.getDislikes() + 1);
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Override
    @Transactional
    public Comment report(Long commentId, String reason) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setReported(true);
                    comment.setReportReason(reason);
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }
}
