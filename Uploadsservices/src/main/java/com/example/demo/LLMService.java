package com.example.demo;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LLMService {

    @Autowired
    private ChatModel chatModel;

    @Value("${llm.timeout-ms:60000}")
    private long timeoutMs;

    private static final ExecutorService EXECUTOR = Executors.newCachedThreadPool();

    public String evaluate(String prompt) {
        String response = callModelWithTimeout(prompt, timeoutMs);
        String json = extractJson(response);

        if (isValidJson(json)) {
            return json;
        }

        throw new RuntimeException(
                "LLM did not return valid JSON.\nLast response: " + response
        );
    }

    private String callModelWithTimeout(String prompt, long timeoutMs) {

        System.out.println("🚀 Sending to LLM...");

        long start = System.currentTimeMillis();

        Future<String> future = EXECUTOR.submit(() -> chatModel.call(prompt));

        String response;
        try {
            response = future.get(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException timeout) {
            future.cancel(true);
            throw new RuntimeException(
                    "LLM call timed out after " + timeoutMs + " ms. " +
                            "Check that Ollama is running and the model is available."
            );
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("LLM call was interrupted", interrupted);
        } catch (ExecutionException execution) {
            throw new RuntimeException("LLM call failed", execution.getCause());
        }

        long end = System.currentTimeMillis();
        long elapsed = end - start;

        System.out.println("✅ LLM response received");
        System.out.println("⏱ Time taken: " + elapsed + " ms");

        return response == null ? "" : response.trim();
    }

    private boolean isValidJson(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }

        String json = extractJson(text);
        return json.startsWith("{") && json.endsWith("}");
    }

    private String extractJson(String text) {
        if (text == null) {
            return "";
        }

        String trimmed = text.trim();

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');

        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }

        return trimmed;
    }
}