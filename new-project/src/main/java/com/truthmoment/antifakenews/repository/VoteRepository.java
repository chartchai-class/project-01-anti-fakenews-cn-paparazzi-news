package com.truthmoment.antifakenews.repository;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndNews(User user, News news);
}