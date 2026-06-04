package com.example.demo;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ResumeResult {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User uploadedBy;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Jobs job;

    private String fileName;
    private String name;
    private String email;
    private double score;
    private String status;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDateTime createdAt;
  
}