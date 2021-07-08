package com.hh99_spring.article.domain;

import com.hh99_spring.article.dto.AritcleRequestDto;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Entity
public class Article extends Timestamped{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String contents;

    public Article(AritcleRequestDto aritcleRequestDto){
        this.username = aritcleRequestDto.getUsername();
        this.title = aritcleRequestDto.getTitle();
        this.contents = aritcleRequestDto.getContents();
    }

    public void update(AritcleRequestDto aritcleRequestDto){
        this.username = aritcleRequestDto.getUsername();
        this.title = aritcleRequestDto.getTitle();
        this.contents = aritcleRequestDto.getContents();
    }
}
