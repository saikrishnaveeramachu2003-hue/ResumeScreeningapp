package com.example.demo;

import lombok.Data;

@Data
public class ResumeModel {

    private String id;

    private Long userId;

    private String fileName;

    private String resumeText;

    private String jobDescription;

    private String prompt;

    // NEW FIELDS
    private Long jobId;

    private String candidateName;

    private String candidateEmail;

    private String candidatePhone;
}