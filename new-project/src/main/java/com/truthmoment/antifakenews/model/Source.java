package com.truthmoment.antifakenews.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String url;
    private String description;

    @Enumerated(EnumType.STRING)
    private CredibilityLevel credibilityLevel;

    public enum CredibilityLevel {
        VERY_LOW,
        LOW,
        MEDIUM,
        HIGH,
        VERY_HIGH
    }

}