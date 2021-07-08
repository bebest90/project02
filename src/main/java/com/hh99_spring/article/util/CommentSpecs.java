package com.hh99_spring.article.util;

import com.hh99_spring.article.domain.Comment;
import org.springframework.data.jpa.domain.Specification;

public class CommentSpecs {

    public static Specification<Comment> withArticle_id(Long article_id) {
        return ((root, query, builder) ->
                builder.equal(root.get("article_id"), article_id)
        );
    }
}
