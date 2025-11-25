package com.truthmoment.antifakenews.service.impl;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.model.Vote;
import com.truthmoment.antifakenews.repository.NewsRepository;
import com.truthmoment.antifakenews.repository.VoteRepository;
import com.truthmoment.antifakenews.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NewsServiceImpl implements NewsService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Override
    public News create(News news) {
        return newsRepository.save(news);
    }

    @Override
    public Optional<News> findById(Long id) {
        return newsRepository.findById(id);
    }

    @Override
    public News update(Long id, News news) {
        return newsRepository.findById(id)
                .map(existingNews -> {
                    existingNews.setTitle(news.getTitle());
                    existingNews.setSummary(news.getSummary());
                    existingNews.setContent(news.getContent());
                    existingNews.setSource(news.getSource());
                    existingNews.setSourceUrl(news.getSourceUrl());
                    existingNews.setCategory(news.getCategory());
                    existingNews.setImage(news.getImage());
                    existingNews.setPublishDate(news.getPublishDate());
                    return newsRepository.save(existingNews);
                })
                .orElseThrow(() -> new RuntimeException("News not found"));
    }

    @Override
    public void delete(Long id) {
        newsRepository.deleteById(id);
    }

    @Override
    public Page<News> findAll(Pageable pageable) {
        return newsRepository.findAll(pageable);
    }

    @Override
    public Page<News> findByCategory(String category, Pageable pageable) {
        return newsRepository.findByCategory(category, pageable);
    }

    @Override
    public Page<News> findBySource(Source source, Pageable pageable) {
        return newsRepository.findBySource(source, pageable);
    }

    @Override
    public Page<News> findByFactChecked(boolean factChecked, Pageable pageable) {
        return newsRepository.findByFactChecked(factChecked, pageable);
    }

    @Override
    public Page<News> findByCategoryAndFactChecked(String category, boolean factChecked, Pageable pageable) {
        return newsRepository.findByCategoryAndFactChecked(category, factChecked, pageable);
    }

    @Override
    @Transactional
    public News vote(Long newsId, User user, Vote.VoteType voteType) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Optional<Vote> existingVote = voteRepository.findByUserAndNews(user, news);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getVoteType() == voteType) {
                voteRepository.delete(vote);
                updateVoteCounts(news, voteType, false);
            } else {
                vote.setVoteType(voteType);
                voteRepository.save(vote);
                updateVoteCounts(news, vote.getVoteType(), false);
                updateVoteCounts(news, voteType, true);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(user);
            vote.setNews(news);
            vote.setVoteType(voteType);
            voteRepository.save(vote);
            updateVoteCounts(news, voteType, true);
        }

        updateCredibilityScoreFromVotes(news);
        return newsRepository.save(news);
    }

    @Override
    @Transactional
    public News updateCredibilityScore(Long newsId, int score, User factChecker) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        news.setCredibilityScore(score);
        news.setFactChecked(true);
        news.setFactChecker(factChecker);
        news.setFactCheckDate(LocalDateTime.now());
        
        if (score >= 80) {
            news.setCredibilityLevel(Source.CredibilityLevel.VERY_HIGH);
        } else if (score >= 60) {
            news.setCredibilityLevel(Source.CredibilityLevel.HIGH);
        } else if (score >= 40) {
            news.setCredibilityLevel(Source.CredibilityLevel.MEDIUM);
        } else if (score >= 20) {
            news.setCredibilityLevel(Source.CredibilityLevel.LOW);
        } else {
            news.setCredibilityLevel(Source.CredibilityLevel.VERY_LOW);
        }

        return newsRepository.save(news);
    }

    private void updateVoteCounts(News news, Vote.VoteType voteType, boolean increment) {
        if (voteType == Vote.VoteType.UPVOTE) {
            news.setUpvotes(increment ? news.getUpvotes() + 1 : news.getUpvotes() - 1);
        } else {
            news.setDownvotes(increment ? news.getDownvotes() + 1 : news.getDownvotes() - 1);
        }
    }

    private void updateCredibilityScoreFromVotes(News news) {
        int totalVotes = news.getUpvotes() + news.getDownvotes();
        if (totalVotes > 0) {
            int score = ((news.getUpvotes() - news.getDownvotes()) * 100) / totalVotes;
            news.setCredibilityScore(score);
        }
    }
}