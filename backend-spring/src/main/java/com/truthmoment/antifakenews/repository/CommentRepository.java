package com.truthmoment.antifakenews.repository;

import com.truthmoment.antifakenews.model.Comment;
import com.truthmoment.antifakenews.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByNews(News news, Pageable pageable);
    Page<Comment> findByParent(Comment parent, Pageable pageable);
    int countByNews(News news);
}
