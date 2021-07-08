package com.hh99_spring.article.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class User extends Timestamped{

    public User(String username, String password, String email){
        this.username = username;
        this.password = password;
        this.email=email;
    }

    public User(String username, String password, String email, Long kakaoId){
        this.username = username;
        this.password = password;
        this.email=email;
        this.kakaoId = kakaoId;
    }

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private Long kakaoId;
}
