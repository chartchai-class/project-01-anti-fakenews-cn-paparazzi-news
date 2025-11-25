package com.truthmoment.antifakenews.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private News news;

    @Enumerated(EnumType.STRING)
    private VoteType voteType;

    public enum VoteType {
        UPVOTE,
        DOWNVOTE
    }

}