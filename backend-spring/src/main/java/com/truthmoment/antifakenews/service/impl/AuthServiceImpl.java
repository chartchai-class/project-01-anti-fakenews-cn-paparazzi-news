package com.truthmoment.antifakenews.service.impl;

import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.service.AuthService;
import com.truthmoment.antifakenews.service.UserService;
import com.truthmoment.antifakenews.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public Map<String, String> login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", username);
        return response;
    }

    @Override
    public Map<String, String> register(User user) {
        if (userService.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userService.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User registeredUser = userService.register(user);
        
        // Generate token for the new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registeredUser.getUsername(), user.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", registeredUser.getUsername());
        return response;
    }

    @Override
    public Map<String, Object> validateToken(String token) {
        return jwtUtils.validateToken(token);
    }
}
