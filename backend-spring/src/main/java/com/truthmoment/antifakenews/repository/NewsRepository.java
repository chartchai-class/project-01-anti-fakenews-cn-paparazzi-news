package com.truthmoment.antifakenews.repository;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.Source;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findByCategory(String category, Pageable pageable);
    Page<News> findBySource(Source source, Pageable pageable);
    Page<News> findByFactChecked(boolean factChecked, Pageable pageable);
    Page<News> findByCategoryAndFactChecked(String category, boolean factChecked, Pageable pageable);
}
