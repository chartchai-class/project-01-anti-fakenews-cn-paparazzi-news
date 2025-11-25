package com.truthmoment.antifakenews.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @GetMapping
    public ResponseEntity<String> getAllNews() {
        return ResponseEntity.ok("Hello, News API is working!");
    }
}
