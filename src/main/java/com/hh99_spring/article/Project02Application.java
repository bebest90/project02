package com.hh99_spring.article;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class Project02Application {

    public static void main(String[] args) {
        SpringApplication.run(Project02Application.class, args);
    }

}
