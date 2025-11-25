package com.truthmoment.antifakenews;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class AntiFakeNewsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AntiFakeNewsBackendApplication.class, args);
    }

}