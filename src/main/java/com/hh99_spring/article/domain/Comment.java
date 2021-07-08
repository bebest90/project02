package com.hh99_spring.article.domain;

import com.hh99_spring.article.dto.CommentReqeustDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class Comment extends Timestamped{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Long article_id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String contents;

    public Comment (CommentReqeustDto commentReqeustDto){
        this.article_id = commentReqeustDto.getArticle_id();
        this.username = commentReqeustDto.getUsername();
        this.contents = commentReqeustDto.getContents();
    }

    public void update_comment(CommentReqeustDto commentReqeustDto){
        this.article_id = commentReqeustDto.getArticle_id();
        this.username = commentReqeustDto.getUsername();
        this.contents = commentReqeustDto.getContents();
    }

}
