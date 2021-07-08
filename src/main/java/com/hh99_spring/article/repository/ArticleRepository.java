package com.hh99_spring.article.repository;

import com.hh99_spring.article.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByOrderByModifiedAtDesc();
}
