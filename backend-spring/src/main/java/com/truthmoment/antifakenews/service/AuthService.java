package com.truthmoment.antifakenews.service;

import com.truthmoment.antifakenews.model.User;

import java.util.Map;

public interface AuthService {
    Map<String, String> login(String username, String password);
    Map<String, String> register(User user);
    Map<String, Object> validateToken(String token);
}
