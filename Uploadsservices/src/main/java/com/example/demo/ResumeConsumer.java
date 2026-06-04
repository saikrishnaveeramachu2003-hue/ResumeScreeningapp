package com.example.demo;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ResumeConsumer {

    @Autowired
    private EmailService emailService;

    @Autowired
    private LLMService llmService;

    @Autowired
    private ResumeResultRepository repository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
private Jobreposi jobRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @KafkaListener(
            topics = "resume-topic",
            groupId = "resume-group"
    )
    public void consume(ResumeModel model) {

        try {
            System.out.println("🔥 Processing: " + model.getFileName());

            // Get JSON response directly from the LLM service
            String cleanJson = llmService.evaluate(model.getPrompt());

            // Parse the JSON response
            ResumeResponseDTO dto = mapper.readValue(cleanJson, ResumeResponseDTO.class);

            // Normalize values
            String name = normalize(
                    dto.getName(),
                    "Unknown Candidate",
                    200
            );

            String email = normalize(
                    dto.getEmail(),
                    "Not Found",
                    200
            );

            // Clamp score
            double score = dto.getScore();

            if (score < 0) {
                score = 0;
            }

            if (score > 100) {
                score = 100;
            }

            // Determine status ONLY from score
            String status;

            if (score >= 80) {
                status = "Shortlisted";
            } else if (score >= 60) {
                status = "Consider";
            } else {
                status = "Rejected";
            }

            // Normalize reason
            String reason = normalize(
                    dto.getReason(),
                    "Resume analyzed successfully.",
                    5000
            );

            // Create final result
            ResumeResult result =
        new ResumeResult();

result.setId(
        getSafeId(model));

result.setName(
        model.getCandidateName());

result.setEmail(
        model.getCandidateEmail());

Jobs job =
        jobRepository
        .findById(
                model.getJobId())
        .orElse(null);

result.setJob(job);

if(job != null &&
   job.getPostedBy() != null){

    result.setUploadedBy(
            job.getPostedBy());
}
            
            // Set the user who uploaded this resume
            if (model.getUserId() != null) {
                Optional<User> userOptional = userRepository.findById(model.getUserId());
                if (userOptional.isPresent()) {
                    result.setUploadedBy(userOptional.get());
                }
            }
            
            result.setFileName(
                    normalize(
                            model.getFileName(),
                            "resume.pdf",
                            255
                    )
            );
            result.setName(name);
            result.setEmail(email);
            result.setScore(score);
            result.setStatus(status);
            result.setReason(reason);
            result.setCreatedAt(LocalDateTime.now());

            // Save to MySQL
            repository.save(result);

            // Send email automatically if shortlisted
            if ("Shortlisted".equalsIgnoreCase(result.getStatus())
                    && result.getEmail() != null
                    && !result.getEmail().isBlank()
                    && !"Not Found".equalsIgnoreCase(result.getEmail())) {

                try {
                    emailService.sendShortlistedEmail(
                            result.getEmail(),
                            result.getName(),
                            model.getJobDescription(),
                            result.getScore()
                    );

                    System.out.println(
                            "📧 Shortlisted email sent to: "
                                    + result.getEmail()
                    );

                } catch (Exception mailException) {
                    System.out.println("❌ Failed to send email");
                    mailException.printStackTrace();
                }
            }

            System.out.println("✅ SAVED TO DB");
            System.out.println("🆔 Request ID: " + result.getId());
            System.out.println("📊 Score: " + result.getScore());
            System.out.println("📌 Status: " + result.getStatus());

        } catch (Exception e) {
            System.out.println("❌ ERROR OCCURRED");
            e.printStackTrace();

            saveFallback(
                    model,
                    "Processing failed: "
                            + e.getClass().getSimpleName()
                            + ": "
                            + (e.getMessage() == null ? "Unknown error" : e.getMessage())
            );
        }
    }

    // Save fallback result if processing fails
    private void saveFallback(
            ResumeModel model,
            String reasonText
    ) {
        try {
            ResumeResult fallback = buildFallbackResult(model, reasonText);
            repository.save(fallback);
            System.out.println("⚠️ Saved fallback result");
        } catch (Exception saveError) {
            saveError.printStackTrace();
        }
    }

    private ResumeResult buildFallbackResult(
            ResumeModel model,
            String reasonText
    ) {
        ResumeResult fallback = new ResumeResult();
        fallback.setId(getSafeId(model));
        fallback.setFileName(
                normalize(
                        model != null ? model.getFileName() : null,
                        "resume.pdf",
                        255
                )
        );

        String resumeText = model != null ? model.getResumeText() : null;
        String jobDescription = model != null ? model.getJobDescription() : null;

        fallback.setName(extractName(resumeText));
        fallback.setEmail(extractEmail(resumeText));

        double score = calculateFallbackScore(jobDescription, resumeText);
        fallback.setScore(score);
        fallback.setStatus(determineStatus(score));

        fallback.setReason(
                normalize(
                        reasonText + " | Fallback analysis applied.",
                        "Processing failed",
                        5000
                )
        );

        return fallback;
    }

    private String extractEmail(String text) {
        if (text == null || text.isBlank()) {
            return "Not Found";
        }

        Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,7}");
        Matcher matcher = emailPattern.matcher(text);

        if (matcher.find()) {
            return normalize(matcher.group().trim(), "Not Found", 200);
        }

        return "Not Found";
    }

    private String extractName(String text) {
        if (text == null || text.isBlank()) {
            return "Unknown Candidate";
        }

        Pattern namePattern = Pattern.compile("(?m)^(?:Name|NAME|name)\\s*[:\\-]\\s*(.+)$");
        Matcher matcher = namePattern.matcher(text);

        if (matcher.find()) {
            String name = matcher.group(1).trim();
            if (!name.isBlank()) {
                return normalize(name, "Unknown Candidate", 200);
            }
        }

        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isBlank()) {
                continue;
            }
            if (trimmed.endsWith(",") || trimmed.endsWith(":") || trimmed.endsWith(".")) {
                continue;
            }
            if (trimmed.matches("^(?i)(experience|education|skills|projects|contact|address|phone|linkedin).*")) {
                continue;
            }
            String[] parts = trimmed.split("\\s+");
            if (parts.length >= 2 && parts.length <= 4) {
                boolean allWordsStartWithUpper = true;
                for (String part : parts) {
                    if (!part.matches("[A-Z][a-z]+")) {
                        allWordsStartWithUpper = false;
                        break;
                    }
                }
                if (allWordsStartWithUpper && !containsLocationMarker(trimmed)) {
                    return normalize(trimmed, "Unknown Candidate", 200);
                }
            }
        }

        return "Unknown Candidate";
    }

    private boolean containsLocationMarker(String text) {
        String lower = text.toLowerCase();
        return lower.contains("india")
                || lower.contains("andhra")
                || lower.contains("pradesh")
                || lower.contains("telangana")
                || lower.contains("bangalore")
                || lower.contains("hyderabad")
                || lower.contains("mumbai")
                || lower.contains("chennai")
                || lower.contains("delhi");
    }

    private double calculateFallbackScore(String jobDescription, String resumeText) {
        if (jobDescription == null || jobDescription.isBlank()
                || resumeText == null || resumeText.isBlank()) {
            return 0;
        }

        Set<String> keywords = extractKeywords(jobDescription);
        if (keywords.isEmpty()) {
            return 0;
        }

        String resumeLower = resumeText.toLowerCase();
        long matches = keywords.stream()
                .filter(resumeLower::contains)
                .count();

        return Math.min(100, Math.round(matches * 100.0 / keywords.size()));
    }


    private Set<String> extractKeywords(String text) {
        if (text == null || text.isBlank()) {
            return Set.of();
        }

        String lower = text.toLowerCase();
        String[] words = lower.split("[^a-z0-9+#]+");
        Set<String> keywords = new HashSet<>();
        Set<String> stopwords = new HashSet<>(Arrays.asList(
                "and", "or", "the", "with", "for", "to", "from", "in", "on", "of", "a", "an", "by", "at", "is", "are", "be", "that", "this", "as", "it", "will", "must", "should"
        ));

        for (String word : words) {
            if (word.length() >= 2 && !stopwords.contains(word)) {
                keywords.add(word);
            }
        }

        return keywords;
    }

    private String determineStatus(double score) {
        if (score >= 80) {
            return "Shortlisted";
        }
        if (score >= 50) {
            return "Consider";
        }
        return "Rejected";
    }

    // Ensure ID is never null
    private String getSafeId(ResumeModel model) {
        if (model == null
                || model.getId() == null
                || model.getId().isBlank()) {
            return UUID.randomUUID().toString();
        }

        return model.getId();
    }

    // Normalize strings
    private String normalize(
            String value,
            String defaultValue,
            int maxLength
    ) {
        String result =
                (value == null || value.isBlank())
                        ? defaultValue
                        : value.trim();

        if (result.length() > maxLength) {
            result = result.substring(0, maxLength);
        }

        return result;
    }
}