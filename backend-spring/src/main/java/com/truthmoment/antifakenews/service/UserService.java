package com.truthmoment.antifakenews.service;

import com.truthmoment.antifakenews.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService extends UserDetailsService {
    User register(User user);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    User update(Long id, User user);
    void delete(Long id);
    Page<User> findAll(Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
