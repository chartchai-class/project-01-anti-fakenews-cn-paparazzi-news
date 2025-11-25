package com.truthmoment.antifakenews.controller;

import com.truthmoment.antifakenews.model.Comment;
import com.truthmoment.antifakenews.model.User;
import com.truthmoment.antifakenews.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Public endpoints
    @GetMapping("/public/news/{newsId}")
    public ResponseEntity<Page<Comment>> getCommentsByNewsPublic(@PathVariable Long newsId, Pageable pageable) {
        return ResponseEntity.ok(commentService.findByNewsId(newsId, pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Comment> getCommentByIdPublic(@PathVariable Long id) {
        return commentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/{id}/replies")
    public ResponseEntity<Page<Comment>> getRepliesPublic(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(commentService.findByParentId(id, pageable));
    }

    // Protected endpoints
    @GetMapping("/news/{newsId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<Comment>> getCommentsByNews(@PathVariable Long newsId, Pageable pageable) {
        return ResponseEntity.ok(commentService.findByNewsId(newsId, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        return commentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/replies")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Page<Comment>> getReplies(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(commentService.findByParentId(id, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> createComment(@RequestBody CommentRequest commentRequest, @RequestAttribute("currentUser") User currentUser) {
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setNewsId(commentRequest.getNewsId());
        
        if (commentRequest.getParentId() != null) {
            Comment parentComment = commentService.findById(commentRequest.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
        }
        
        return ResponseEntity.ok(commentService.create(comment, currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody CommentRequest commentRequest, @RequestAttribute("currentUser") User currentUser) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Check if user is the owner of the comment or an admin
        if (!comment.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ROLE_ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        
        comment.setContent(commentRequest.getContent());
        
        return ResponseEntity.ok(commentService.update(id, comment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, @RequestAttribute("currentUser") User currentUser) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Check if user is the owner of the comment or an admin
        if (!comment.getAuthor().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ROLE_ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> likeComment(@PathVariable Long id, @RequestAttribute("currentUser") User currentUser) {
        return ResponseEntity.ok(commentService.likeComment(id, currentUser));
    }

    @PostMapping("/{id}/dislike")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> dislikeComment(@PathVariable Long id, @RequestAttribute("currentUser") User currentUser) {
        return ResponseEntity.ok(commentService.dislikeComment(id, currentUser));
    }

    @PostMapping("/{id}/report")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('FACT_CHECKER')")
    public ResponseEntity<Comment> reportComment(@PathVariable Long id, @RequestBody ReportRequest reportRequest, @RequestAttribute("currentUser") User currentUser) {
        return ResponseEntity.ok(commentService.reportComment(id, currentUser, reportRequest.getReason()));
    }

    // Request DTOs
    public static class CommentRequest {
        private String content;
        private Long newsId;
        private Long parentId;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Long getNewsId() {
            return newsId;
        }

        public void setNewsId(Long newsId) {
            this.newsId = newsId;
        }

        public Long getParentId() {
            return parentId;
        }

        public void setParentId(Long parentId) {
            this.parentId = parentId;
        }
    }

    public static class ReportRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
