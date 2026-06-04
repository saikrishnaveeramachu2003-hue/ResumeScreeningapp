package com.example.demo;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Jobs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;
    
private String skills;

private String experience;

    private String status;

    @ManyToOne
    @JoinColumn(name = "posted_by_id")
    private User postedBy;

    private LocalDateTime createdAt;
    private String location;
private String experienceLevel;
private String salaryRange;
private Integer openings;
private String education;
}
