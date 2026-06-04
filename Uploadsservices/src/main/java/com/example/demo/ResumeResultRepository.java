package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ResumeResultRepository extends JpaRepository<ResumeResult, String> {
    
    // Find all resumes uploaded by a specific user
    List<ResumeResult> findByUploadedById(Long userId);
    
    // Find a specific resume by ID and user ID (for authorization check)
    ResumeResult findByIdAndUploadedById(String id, Long userId);
    long countByJobId(Long jobId);

long countByJobIdAndStatus(
        Long jobId,
        String status
);

@Transactional
@Modifying
void deleteByJobId(Long jobId);
   
}