package com.truthmoment.antifakenews.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String summary;
    private String content;
    private String sourceUrl;
    private String category;
    private String image;
    private LocalDateTime publishDate;
    private int credibilityScore;
    private boolean factChecked;
    private int upvotes;
    private int downvotes;

    @ManyToOne
    private Source source;

    @ManyToOne
    private User factChecker;
    private LocalDateTime factCheckDate;

    @Enumerated(EnumType.STRING)
    private Source.CredibilityLevel credibilityLevel;

}