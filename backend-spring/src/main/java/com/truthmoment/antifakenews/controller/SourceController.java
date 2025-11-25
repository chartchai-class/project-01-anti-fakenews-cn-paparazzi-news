package com.truthmoment.antifakenews.controller;

import com.truthmoment.antifakenews.model.Source;
import com.truthmoment.antifakenews.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    @Autowired
    private SourceService sourceService;

    // Public endpoints
    @GetMapping("/public")
    public ResponseEntity<Page<Source>> getAllSourcesPublic(Pageable pageable) {
        return ResponseEntity.ok(sourceService.findAll(pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Source> getSourceByIdPublic(@PathVariable Long id) {
        return sourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/validate/{name}")
    public ResponseEntity<Boolean> validateSourcePublic(@PathVariable String name) {
        return ResponseEntity.ok(sourceService.validateSource(name));
    }

    // Protected endpoints
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<Source>> getAllSources(Pageable pageable) {
        return ResponseEntity.ok(sourceService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Source> getSourceById(@PathVariable Long id) {
        return sourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Source> createSource(@RequestBody Source source) {
        return ResponseEntity.ok(sourceService.create(source));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Source> updateSource(@PathVariable Long id, @RequestBody Source source) {
        return ResponseEntity.ok(sourceService.update(id, source));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSource(@PathVariable Long id) {
        sourceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validate/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Boolean> validateSource(@PathVariable String name) {
        return ResponseEntity.ok(sourceService.validateSource(name));
    }

    @PostMapping("/{id}/update-credibility")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Source> updateSourceCredibility(@PathVariable Long id, @RequestBody CredibilityRequest credibilityRequest) {
        return ResponseEntity.ok(sourceService.updateCredibilityScore(id, credibilityRequest.getScore()));
    }

    // Request DTOs
    public static class CredibilityRequest {
        private int score;

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }
    }
}
