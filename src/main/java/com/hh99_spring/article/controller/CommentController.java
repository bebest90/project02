package com.hh99_spring.article.controller;

import com.hh99_spring.article.domain.Comment;
import com.hh99_spring.article.dto.CommentReqeustDto;
import com.hh99_spring.article.repository.CommentRepository;
import com.hh99_spring.article.service.CommentService;
import com.hh99_spring.article.util.CommentSpecs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CommentController {

    private final CommentRepository commentRepository;
    private final CommentService commentService;

//    @GetMapping("/api/comments")
//    public List<Comment> getComment(){
//        return commentRepository.findAllByOrderByModifiedAtDesc();
//    }


    @GetMapping("/api/comment/{article_id}")
    public List<Comment> getComment(@PathVariable Long article_id){
        return commentRepository.findAll(CommentSpecs.withArticle_id(article_id));
    }


    @PostMapping("/api/comments")
    public Comment createComment(@RequestBody CommentReqeustDto commentReqeustDto){
        Comment comment = new Comment(commentReqeustDto);
        return commentRepository.save(comment);
    }

    @PutMapping("/api/comments/{id}")
    public Long updateComment(@PathVariable Long id, @RequestBody CommentReqeustDto commentReqeustDto){
        return commentService.update_comment(id, commentReqeustDto);
    }

    @DeleteMapping("/api/comments/{id}")
    public Long deleteComment(@PathVariable Long id){
        commentRepository.deleteById(id);
        return id;
    }
}
