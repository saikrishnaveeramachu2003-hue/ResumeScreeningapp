package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, ResumeModel> kafkaTemplate;

    public String sendMessage(ResumeModel model) {

        // Validate input
        if (model == null) {
            throw new RuntimeException("ResumeModel cannot be null");
        }

        if (model.getId() == null || model.getId().isBlank()) {
            throw new RuntimeException("Resume ID cannot be null");
        }

        // Send to Kafka
        kafkaTemplate.send("resume-topic", model);

        // Logging
        System.out.println("==================================");
        System.out.println("✅ Sent To Kafka");
        System.out.println("🆔 Request ID : " + model.getId());
        System.out.println("📄 File Name  : " + model.getFileName());
        System.out.println("📌 Topic      : resume-topic");
        System.out.println("==================================");

        return "Resume Sent Successfully";
    }
}
