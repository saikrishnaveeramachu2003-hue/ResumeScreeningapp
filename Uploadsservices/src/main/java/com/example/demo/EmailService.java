package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendShortlistedEmail(
            String toEmail,
            String candidateName,
            String jobRole,
            double score
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Congratulations! You Have Been Shortlisted");

        String body = """
Dear %s,

Congratulations! You have been shortlisted for the position of %s.



Our recruitment team will contact you with the next steps.

Best regards,
HR Team
""".formatted(candidateName, jobRole, score);

        message.setText(body);

        mailSender.send(message);

        System.out.println("📧 Email sent to: " + toEmail);
    }

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your account verification code");

        String body = "Your OTP code is: " + otp + "\n\n" +
                "Enter this code to verify your email address and complete login.";
        message.setText(body);

        mailSender.send(message);
        System.out.println("📧 OTP email sent to: " + toEmail + " with code " + otp);
    }
}