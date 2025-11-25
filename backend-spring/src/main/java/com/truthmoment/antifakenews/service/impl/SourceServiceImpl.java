package com.truthmoment.antifakenews.service.impl;

import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.repository.SourceRepository;
import com.truthmoment.antifakenews.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SourceServiceImpl implements SourceService {

    @Autowired
    private SourceRepository sourceRepository;

    @Override
    public Source create(Source source) {
        return sourceRepository.save(source);
    }

    @Override
    public Optional<Source> findById(Long id) {
        return sourceRepository.findById(id);
    }

    @Override
    public Optional<Source> findByName(String name) {
        return sourceRepository.findByName(name);
    }

    @Override
    public Source update(Long id, Source source) {
        return sourceRepository.findById(id)
                .map(existingSource -> {
                    existingSource.setName(source.getName());
                    existingSource.setUrl(source.getUrl());
                    existingSource.setDescription(source.getDescription());
                    existingSource.setType(source.getType());
                    existingSource.setBias(source.getBias());
                    existingSource.setImage(source.getImage());
                    return sourceRepository.save(existingSource);
                })
                .orElseThrow(() -> new RuntimeException("Source not found"));
    }

    @Override
    public void delete(Long id) {
        sourceRepository.deleteById(id);
    }

    @Override
    public Page<Source> findAll(Pageable pageable) {
        return sourceRepository.findAll(pageable);
    }

    @Override
    public boolean existsByName(String name) {
        return sourceRepository.existsByName(name);
    }

    @Override
    public Source verify(Long sourceId, User user) {
        return sourceRepository.findById(sourceId)
                .map(source -> {
                    source.setVerified(true);
                    source.setVerifiedBy(user);
                    source.setVerifiedDate(LocalDateTime.now());
                    return sourceRepository.save(source);
                })
                .orElseThrow(() -> new RuntimeException("Source not found"));
    }

    @Override
    public Source updateCredibilityScore(Long sourceId, int score) {
        return sourceRepository.findById(sourceId)
                .map(source -> {
                    source.setCredibilityScore(score);
                    
                    // Update credibility level based on score
                    if (score >= 80) {
                        source.setCredibilityLevel(Source.CredibilityLevel.VERY_HIGH);
                    } else if (score >= 60) {
                        source.setCredibilityLevel(Source.CredibilityLevel.HIGH);
                    } else if (score >= 40) {
                        source.setCredibilityLevel(Source.CredibilityLevel.MEDIUM);
                    } else if (score >= 20) {
                        source.setCredibilityLevel(Source.CredibilityLevel.LOW);
                    } else {
                        source.setCredibilityLevel(Source.CredibilityLevel.VERY_LOW);
                    }
                    
                    return sourceRepository.save(source);
                })
                .orElseThrow(() -> new RuntimeException("Source not found"));
    }
}
