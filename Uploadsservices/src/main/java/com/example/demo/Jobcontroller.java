package com.example.demo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://16.113.16.42:5173"})
public class Jobcontroller {

    @Autowired
    private Jobreposi jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeResultRepository resumeRepository;

      @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Jobs>> getAllJobs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return ResponseEntity.ok(jobRepository.findAll());
        }

        return ResponseEntity.ok(jobRepository.findByPostedById(userDetails.getId()));
    }
@PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@GetMapping("/recent")
public ResponseEntity<?> getRecentJobs() {

    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        List<Jobs> jobs;
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            jobs = jobRepository.findTop5ByOrderByCreatedAtDesc();
        } else {
            jobs = jobRepository.findTop5ByPostedByIdOrderByCreatedAtDesc(userDetails.getId());
        }

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (Jobs job : jobs) {

            Map<String, Object> map =
                    new HashMap<>();

            long resumes =
                    resumeRepository.countByJobId(
                            job.getId());

            long shortlisted =
                    resumeRepository
                    .countByJobIdAndStatus(
                            job.getId(),
                            "Shortlisted");

            map.put("id", job.getId());
            map.put("jobTitle", job.getJobTitle());
            map.put("createdAt", job.getCreatedAt());
            map.put("status", job.getStatus());
            map.put("resumes", resumes);
            map.put("shortlisted", shortlisted);

            response.add(map);
        }

        return ResponseEntity.ok(response);

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity.internalServerError()
                .body(e.getMessage());
    }

}
 


@PostMapping
public ResponseEntity<Map<String,Object>> createJob(
        @RequestBody Jobs job) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User currentUser = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    job.setCreatedAt(LocalDateTime.now());
    job.setStatus("Active");
    job.setPostedBy(currentUser);

    Jobs savedJob =
            jobRepository.save(job);

   String applyLink =
    "http://16.113.16.42:5173/apply/" + savedJob.getId();

    Map<String,Object> response =
            new HashMap<>();

    response.put("job", savedJob);
    response.put("applyUrl", applyLink);

    return ResponseEntity.ok(response);
}
  @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteJob(
        @PathVariable Long id) {

    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        Jobs job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Not Found"));

        if (!"ROLE_ADMIN".equals(currentUserRole) &&
                (job.getPostedBy() == null || !job.getPostedBy().getId().equals(userDetails.getId()))) {
            return ResponseEntity.status(403).body("You don't have permission to delete this job");
        }

        resumeRepository.deleteByJobId(id);

        jobRepository.deleteById(id);

        return ResponseEntity.ok(
                "Job Deleted Successfully");

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(e.getMessage());
    }
}

@GetMapping("/{id}")
public ResponseEntity<?> getJobById(
        @PathVariable Long id) {

    return jobRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

  @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")

@PutMapping("/{id}")
public ResponseEntity<?> updateJob(
        @PathVariable Long id,
        @RequestBody Jobs updatedJob) {

    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String currentUserRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        Jobs job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Not Found"));

        if (!"ROLE_ADMIN".equals(currentUserRole) &&
                (job.getPostedBy() == null || !job.getPostedBy().getId().equals(userDetails.getId()))) {
            return ResponseEntity.status(403).body("You don't have permission to update this job");
        }

        job.setJobTitle(
                updatedJob.getJobTitle());

        job.setJobDescription(
                updatedJob.getJobDescription());

        job.setSkills(
                updatedJob.getSkills());

        job.setExperience(
                updatedJob.getExperience());

        job.setLocation(
                updatedJob.getLocation());

        job.setExperienceLevel(
                updatedJob.getExperienceLevel());

        job.setSalaryRange(
                updatedJob.getSalaryRange());

        job.setOpenings(
                updatedJob.getOpenings());

        job.setEducation(
                updatedJob.getEducation());

        return ResponseEntity.ok(
                jobRepository.save(job));

    } catch (Exception e) {

        return ResponseEntity
                .internalServerError()
                .body(e.getMessage());
    }
}

}
