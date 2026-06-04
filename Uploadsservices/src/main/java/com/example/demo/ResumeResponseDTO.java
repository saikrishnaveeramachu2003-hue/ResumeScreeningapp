package com.example.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeResponseDTO {

    // Candidate name extracted from the resume
    private String name;

    // Candidate email extracted from the resume
    private String email;

    // Match score from 0 to 100
    private double score;

    // Allowed values:
    // Shortlisted
    // Consider
    // Rejected
    private String status;

    // Explanation for the score and decision
    private String reason;
}