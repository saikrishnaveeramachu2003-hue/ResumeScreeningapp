// ResumeController.java
package com.example.demo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://16.113.16.42:5173"})
public class ResumeController {

    @Autowired
    private KafkaProducerService producer;

    @Autowired
    private ResumeResultRepository repository;

    @Autowired
private Jobreposi jobRepository;

    /**
     * Upload multiple resumes with a dynamic job description entered by HR.
     *
     * Form Data:
     * - jobDescription : Any job description / keywords
     * - files          : Multiple resume files
     *
     * Example jobDescription:
     * "Java Backend Developer with 2+ years experience.
     *  Skills: Java, Spring Boot, Kafka, MySQL, REST APIs."
     */
    
    @PostMapping("/apply")
public ResponseEntity<List<Map<String, Object>>> apply(

@RequestParam Long jobId,

    @RequestParam String name,

    @RequestParam String email,

    @RequestParam String phone,

    @RequestParam("files") MultipartFile[] files) {
Jobs job =
        jobRepository.findById(jobId)
        .orElseThrow(() ->
                new RuntimeException(
                        "Job Not Found"));

String jobDescription =
        job.getJobDescription();

List<Map<String, Object>> responses =
        new ArrayList<>();

for (MultipartFile file : files) {

    try {

        String resumeText =
                FileUtil.extractText(file);

        String requestId =
                UUID.randomUUID().toString();

        ResumeModel model =
                new ResumeModel();

        model.setId(requestId);

        model.setFileName(
                file.getOriginalFilename());

        model.setResumeText(
                resumeText);

        model.setJobDescription(
                jobDescription);

        model.setPrompt(
                buildPrompt(
                        jobDescription,
                        resumeText));
                        model.setJobId(jobId);

model.setCandidateName(name);

model.setCandidateEmail(email);

model.setCandidatePhone(phone);

        producer.sendMessage(model);

        Map<String, Object> item =
                new HashMap<>();

        item.put(
                "requestId",
                requestId);

        item.put(
                "candidateName",
                name);

        item.put(
                "email",
                email);

        item.put(
                "phone",
                phone);

        item.put(
                "jobTitle",
                job.getJobTitle());

        item.put(
                "fileName",
                file.getOriginalFilename());

        item.put(
                "status",
                "PROCESSING");

        item.put(
                "success",
                true);

        responses.add(item);

    } catch (Exception e) {

        Map<String, Object> item =
                new HashMap<>();

        item.put(
                "fileName",
                file.getOriginalFilename());

        item.put(
                "success",
                false);

        item.put(
                "message",
                e.getMessage());

        responses.add(item);
    }
}

return ResponseEntity.ok(
        responses);


}


    /**
     * Get final screening result by request ID.
     * HR users can only access their own resume results.
     * ADMIN users can access all results.
     */
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    @GetMapping("/result/{id}")
    public ResponseEntity<?> getResult(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "User not authenticated"
            ));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .findFirst()
                .orElse("");

        // ADMIN can access all results
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return repository.findById(id)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok(Map.of(
                            "requestId", id,
                            "status", "PROCESSING",
                            "message", "Resume is still being analyzed"
                    )));
        }

        // HR users can only access their own results
        ResumeResult result = repository.findByIdAndUploadedById(id, currentUserId);
        if (result != null) {
            return ResponseEntity.ok(result);
        }

        return ResponseEntity.status(403).body(Map.of(
                "error", "Forbidden",
                "message", "You don't have permission to access this resume result"
        ));
    }

    /**
     * Build prompt dynamically from:
     * - HR-entered job description
     * - Extracted resume text
     */
    private String buildPrompt(
            String jobDescription,
            String resumeText) {

        String safeJobDescription = jobDescription == null ? "" : jobDescription.trim();
        String safeResumeText = resumeText == null ? "" : resumeText.trim();

        // Limit resume size for faster processing but preserve enough context
        String shortResume = safeResumeText.length() <= 1200
                ? safeResumeText
                : safeResumeText.substring(0, 1200);

        String template = """
You are an ATS evaluator.
Compare the JOB DESCRIPTION and RESUME and return only valid JSON.
Do not include any extra text, explanation, markdown, or code fences.
Do not invent information.
Base your decision only on the information explicitly present in the resume and the job description.

Output schema:
{
  "name": "Unknown Candidate",
  "email": "Not Found",
  "score": 0,
  "status": "Rejected",
  "reason": "Reason for the decision"
}

Rules:
1. Use only the information in the JOB DESCRIPTION and RESUME.
2. If name or email cannot be found, use Unknown Candidate / Not Found.
3. Status must be one of: Shortlisted, Consider, Rejected.
4. Score must be an integer between 0 and 100.
5. Decide score and status from the resume evidence relative to the job requirements.
6. Do not guess or invent any details that are not in the resume text.

JOB DESCRIPTION:
{{jobDescription}}

RESUME:
{{resumeText}}
""";

        return template
                .replace("{{jobDescription}}", safeJobDescription)
                .replace("{{resumeText}}", shortResume);
    }
  
    /**
     * Get all processed resume results.
     * HR users can only see their own results.
     * ADMIN users can see all results.
     */
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    @GetMapping("/results")
    public ResponseEntity<List<ResumeResult>> getAllResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body(new ArrayList<>());
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .findFirst()
                .orElse("");

        List<ResumeResult> results;

        if ("ROLE_ADMIN".equals(currentUserRole)) {
            // ADMIN can see all results
            results = repository.findAll();
        } else {
            // HR users can only see their own results
            results = repository.findByUploadedById(currentUserId);
        }

        return ResponseEntity.ok(results);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAllResults() {

        repository.deleteAll();
        return ResponseEntity.ok(
                "All resume results deleted successfully."
        );
    }

    /**
     * Delete a specific resume result by ID.
     * HR users can only delete their own results.
     * ADMIN users can delete any result.
     */
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(
            @PathVariable String id) {

        if (!repository.existsById(id)) {
            return ResponseEntity
                    .status(404)
                    .body("Record not found: " + id);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .findFirst()
                .orElse("");

        // Check if user is ADMIN or if it's their own record
        if (!"ROLE_ADMIN".equals(currentUserRole)) {
            ResumeResult result = repository.findById(id).orElse(null);
            if (result == null || result.getUploadedBy() == null || !result.getUploadedBy().getId().equals(currentUserId)) {
                return ResponseEntity.status(403).body(
                        "You don't have permission to delete this resume result"
                );
            }
        }

        repository.deleteById(id);

        return ResponseEntity.ok(
                "Record deleted successfully: " + id
        );
    }
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/dashboard/stats")
public ResponseEntity<Map<String, Object>> getDashboardStats() {

    Authentication authentication =
            SecurityContextHolder
            .getContext()
            .getAuthentication();

    if (authentication == null ||
        authentication.getPrincipal() == null) {

        return ResponseEntity
                .status(401)
                .body(Map.of(
                        "error",
                        "Unauthorized"
                ));
    }

    UserDetailsImpl userDetails =
            (UserDetailsImpl)
                    authentication.getPrincipal();

    Long currentUserId =
            userDetails.getId();

    String currentUserRole =
            userDetails.getAuthorities()
                    .stream()
                    .map(auth ->
                            auth.getAuthority())
                    .findFirst()
                    .orElse("");

    List<ResumeResult> results;

    if ("ROLE_ADMIN".equals(currentUserRole)) {

        results = repository.findAll();

    } else {

        results =
                repository.findByUploadedById(
                        currentUserId
                );
    }

    long totalResumes =
            results.size();

    long shortlisted =
            results.stream()
                    .filter(r ->
                            "Shortlisted"
                                    .equalsIgnoreCase(
                                            r.getStatus()
                                    ))
                    .count();

    long rejected =
            results.stream()
                    .filter(r ->
                            "Rejected"
                                    .equalsIgnoreCase(
                                            r.getStatus()
                                    ))
                    .count();

    long underReview =
            results.stream()
                    .filter(r ->
                            "Consider"
                                    .equalsIgnoreCase(
                                            r.getStatus()
                                    ))
                    .count();

    Map<String, Object> stats =
            new HashMap<>();

    long totalJobs;
    if ("ROLE_ADMIN".equals(currentUserRole)) {
        totalJobs = jobRepository.count();
    } else {
        totalJobs = jobRepository.countByPostedById(currentUserId);
    }

    stats.put(
            "totalJobs",
            totalJobs
    );

    stats.put(
            "totalResumes",
            totalResumes
    );

    stats.put(
            "shortlisted",
            shortlisted
    );

    stats.put(
            "rejected",
            rejected
    );

    stats.put(
            "underReview",
            underReview
    );

    return ResponseEntity.ok(stats);
}
@PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/dashboard/recent-uploads")
public ResponseEntity<List<ResumeResult>> getRecentUploads() {

    Authentication authentication =
            SecurityContextHolder
            .getContext()
            .getAuthentication();

    UserDetailsImpl userDetails =
            (UserDetailsImpl)
            authentication.getPrincipal();

    Long currentUserId =
            userDetails.getId();

    List<ResumeResult> uploads =
            repository.findByUploadedById(
                    currentUserId
            );

    return ResponseEntity.ok(
            uploads
    );
}

  @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/dashboard/chart")
public ResponseEntity<List<Map<String, Object>>> getChartData() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    UserDetailsImpl userDetails =
            (UserDetailsImpl) authentication.getPrincipal();
    String currentUserRole = userDetails.getAuthorities().stream()
            .map(auth -> auth.getAuthority())
            .findFirst()
            .orElse("");

    Long currentUserId = userDetails.getId();

    List<ResumeResult> results;
    if ("ROLE_ADMIN".equals(currentUserRole)) {
        results = repository.findAll();
    } else {
        results = repository.findByUploadedById(currentUserId);
    }

    Map<String, Long> groupedData =
            results.stream()
                    .filter(r -> r.getCreatedAt() != null)
                    .collect(Collectors.groupingBy(
                            r -> r.getCreatedAt()
                                  .toLocalDate()
                                  .toString(),
                            Collectors.counting()
                    ));

    List<Map<String, Object>> chart =
            new ArrayList<>();

    groupedData.forEach((date, count) -> {
        chart.add(Map.of(
                "date", date,
                "count", count
        ));
    });

    return ResponseEntity.ok(chart);
}

@PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/dashboard/status-distribution")
public ResponseEntity<Map<String, Object>> getStatusDistribution() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String currentUserRole = userDetails.getAuthorities().stream()
            .map(auth -> auth.getAuthority())
            .findFirst()
            .orElse("");

    List<ResumeResult> results;
    if ("ROLE_ADMIN".equals(currentUserRole)) {
        results = repository.findAll();
    } else {
        results = repository.findByUploadedById(userDetails.getId());
    }

    long shortlisted = results.stream()
            .filter(r -> "Shortlisted".equalsIgnoreCase(r.getStatus()))
            .count();

    long underReview = results.stream()
            .filter(r -> "Consider".equalsIgnoreCase(r.getStatus()))
            .count();

    long rejected = results.stream()
            .filter(r -> "Rejected".equalsIgnoreCase(r.getStatus()))
            .count();

    Map<String, Object> response = new HashMap<>();

    response.put("total", results.size());
    response.put("shortlisted", shortlisted);
    response.put("underReview", underReview);
    response.put("rejected", rejected);

    return ResponseEntity.ok(response);
}
 @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/dashboard/latest-uploads")
public ResponseEntity<List<Map<String,Object>>> getRecentUpload() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String currentUserRole = userDetails.getAuthorities().stream()
            .map(auth -> auth.getAuthority())
            .findFirst()
            .orElse("");

    List<ResumeResult> uploads;
    if ("ROLE_ADMIN".equals(currentUserRole)) {
        uploads = repository.findAll();
    } else {
        uploads = repository.findByUploadedById(userDetails.getId());
    }

    List<Map<String,Object>> response =
            new ArrayList<>();

    for(ResumeResult r : uploads){

        Map<String,Object> map =
                new HashMap<>();

        map.put("fileName",
                r.getFileName());

        map.put("jobTitle",
                r.getJob() != null
                ? r.getJob().getJobTitle()
                : "N/A");

        map.put("uploadedOn",
                r.getCreatedAt());

        map.put("status",
                r.getStatus());

        response.add(map);
    }

    return ResponseEntity.ok(response);
}

}