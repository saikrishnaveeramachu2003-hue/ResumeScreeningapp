package com;



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

    private String status;

    private LocalDateTime createdAt;
}
