package com.truthmoment.antifakenews.service;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.model.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface NewsService {
    News create(News news);
    Optional<News> findById(Long id);
    News update(Long id, News news);
    void delete(Long id);
    Page<News> findAll(Pageable pageable);
    Page<News> findByCategory(String category, Pageable pageable);
    Page<News> findBySource(Source source, Pageable pageable);
    Page<News> findByFactChecked(boolean factChecked, Pageable pageable);
    Page<News> findByCategoryAndFactChecked(String category, boolean factChecked, Pageable pageable);
    News vote(Long newsId, User user, Vote.VoteType voteType);
    News updateCredibilityScore(Long newsId, int score, User factChecker);
}
