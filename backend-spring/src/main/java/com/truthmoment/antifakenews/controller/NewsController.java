package com.truthmoment.antifakenews.controller;

import com.truthmoment.antifakenews.model.News;
import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.model.Vote;
import com.truthmoment.antifakenews.service.NewsService;
import com.truthmoment.antifakenews.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @Autowired
    private SourceService sourceService;

    // Public endpoints
    @GetMapping("/public")
    public ResponseEntity<Page<News>> getAllNewsPublic(Pageable pageable) {
        return ResponseEntity.ok(newsService.findAll(pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<News> getNewsByIdPublic(@PathVariable Long id) {
        return newsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<Page<News>> getNewsByCategoryPublic(@PathVariable String category, Pageable pageable) {
        return ResponseEntity.ok(newsService.findByCategory(category, pageable));
    }

    @GetMapping("/public/fact-checked")
    public ResponseEntity<Page<News>> getFactCheckedNewsPublic(Pageable pageable) {
        return ResponseEntity.ok(newsService.findByFactChecked(true, pageable));
    }

    // Protected endpoints
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<News>> getAllNews(Pageable pageable) {
        return ResponseEntity.ok(newsService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return newsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<News> createNews(@RequestBody News news) {
        // Validate source exists
        Source source = sourceService.findById(news.getSource().getId())
                .orElseThrow(() -> new RuntimeException("Source not found"));
        news.setSource(source);
        
        return ResponseEntity.ok(newsService.create(news));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody News news) {
        // Validate source exists
        if (news.getSource() != null) {
            Source source = sourceService.findById(news.getSource().getId())
                    .orElseThrow(() -> new RuntimeException("Source not found"));
            news.setSource(source);
        }
        
        return ResponseEntity.ok(newsService.update(id, news));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<News>> getNewsByCategory(@PathVariable String category, Pageable pageable) {
        return ResponseEntity.ok(newsService.findByCategory(category, pageable));
    }

    @GetMapping("/source/{sourceId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<News>> getNewsBySource(@PathVariable Long sourceId, Pageable pageable) {
        Source source = sourceService.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source not found"));
        return ResponseEntity.ok(newsService.findBySource(source, pageable));
    }

    @GetMapping("/fact-checked")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<News>> getFactCheckedNews(Pageable pageable) {
        return ResponseEntity.ok(newsService.findByFactChecked(true, pageable));
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<News> voteNews(@PathVariable Long id, @RequestBody VoteRequest voteRequest, @RequestAttribute("currentUser") User currentUser) {
        return ResponseEntity.ok(newsService.vote(id, currentUser, voteRequest.getVoteType()));
    }

    @PostMapping("/{id}/fact-check")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<News> factCheckNews(@PathVariable Long id, @RequestBody FactCheckRequest factCheckRequest, @RequestAttribute("currentUser") User currentUser) {
        return ResponseEntity.ok(newsService.updateCredibilityScore(id, factCheckRequest.getScore(), currentUser));
    }

    // Request DTOs
    public static class VoteRequest {
        private Vote.VoteType voteType;

        public Vote.VoteType getVoteType() {
            return voteType;
        }

        public void setVoteType(Vote.VoteType voteType) {
            this.voteType = voteType;
        }
    }

    public static class FactCheckRequest {
        private int score;

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }
    }
}
