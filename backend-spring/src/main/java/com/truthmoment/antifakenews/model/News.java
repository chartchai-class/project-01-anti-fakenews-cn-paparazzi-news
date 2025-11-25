package com.truthmoment.antifakenews.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String summary;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Source source;

    @Column(name = "source_url")
    private String sourceUrl;

    @NotBlank
    @Column(nullable = false)
    private String category;

    private String image;

    @Column(name = "publish_date")
    private LocalDateTime publishDate;

    // Credibility fields
    @Column(name = "credibility_score", nullable = false)
    private int credibilityScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "credibility_level", nullable = false)
    private Source.CredibilityLevel credibilityLevel = Source.CredibilityLevel.MEDIUM;

    @Column(name = "fact_checked", nullable = false)
    private boolean factChecked = false;

    @ManyToOne
    @JoinColumn(name = "fact_checker_id")
    private User factChecker;

    @Column(name = "fact_check_date")
    private LocalDateTime factCheckDate;

    // Voting fields
    @Column(nullable = false)
    private int upvotes = 0;

    @Column(nullable = false)
    private int downvotes = 0;

    @Column(name = "comments_count", nullable = false)
    private int commentsCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Vote> votes = new HashSet<>();
}
