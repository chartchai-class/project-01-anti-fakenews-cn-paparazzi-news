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
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;

    private String url;

    private String description;

    @Column(nullable = false)
    private int credibilityScore = 50;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CredibilityLevel credibilityLevel = CredibilityLevel.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SourceType type = SourceType.MAINSTREAM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Bias bias = Bias.UNKNOWN;

    @Column(nullable = false)
    private boolean verified = false;

    @ManyToOne
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    private LocalDateTime verifiedDate;

    @Column(nullable = false)
    private int newsCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "source", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<News> news = new HashSet<>();

    public enum CredibilityLevel {
        VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH
    }

    public enum SourceType {
        MAINSTREAM, ALTERNATIVE, SOCIAL_MEDIA, BLOG, GOVERNMENT, INTERNATIONAL
    }

    public enum Bias {
        LEFT, CENTER_LEFT, CENTER, CENTER_RIGHT, RIGHT, NEUTRAL, UNKNOWN
    }
}
