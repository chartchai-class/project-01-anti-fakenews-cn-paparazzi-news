package com.truthmoment.antifakenews.repository;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndNews(User user, News news);
    int countByNewsAndVoteType(News news, Vote.VoteType voteType);
    boolean existsByUserAndNews(User user, News news);
}
