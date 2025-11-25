package com.truthmoment.antifakenews.service;

import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface SourceService {
    Source create(Source source);
    Optional<Source> findById(Long id);
    Optional<Source> findByName(String name);
    Source update(Long id, Source source);
    void delete(Long id);
    Page<Source> findAll(Pageable pageable);
    boolean existsByName(String name);
    Source verify(Long sourceId, User user);
    Source updateCredibilityScore(Long sourceId, int score);
}
