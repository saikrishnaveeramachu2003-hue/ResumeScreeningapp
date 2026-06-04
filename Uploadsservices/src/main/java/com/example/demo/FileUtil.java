package com.example.demo;

import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

public class FileUtil {

    private static final Tika TIKA = new Tika();

    public static String extractText(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String text = TIKA.parseToString(file.getInputStream());

            if (text == null || text.isBlank()) {
                throw new RuntimeException("No readable text found in file");
            }

            return text.trim();

        } catch (Exception e) {
            throw new RuntimeException(
                "Error reading file: " + file.getOriginalFilename(),
                e
            );
        }
    }
}