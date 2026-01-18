package com.workhive.api.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workhive.api.dto.ai.AiExtractionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private static final String API_KEY = "AIzaSyCYCZu28Hyw8UT33gzoxbKOsmOatT2bKkU";

    private final ObjectMapper objectMapper;

    public AiExtractionResponse extractReservationDetails(String userQuery) {
        RestTemplate restTemplate = new RestTemplate();
        LocalDateTime now = LocalDateTime.now();

        String finalUrl = BASE_URL + API_KEY;

        String prompt = String.format(
                "Current date: %s. " +
                        "User request: '%s'. " +
                        "Task: Extract reservation details into JSON. " +
                        "Rules: " +
                        "1. locationName: Building name (fuzzy match). " +
                        "2. spaceType: 'WORKSPACE' or 'MEETING_ROOM'. " +
                        "3. startTime: ISO 8601 (yyyy-MM-ddTHH:mm). Calculate relative dates (tomorrow, next friday) based on current date. " +
                        "4. endTime: ISO 8601. Default duration 2h if not specified. " +
                        "Output: RAW JSON {locationName, spaceType, startTime, endTime}. NO Markdown.",
                now, userQuery
        );

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(finalUrl, HttpMethod.POST, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            if (root.path("candidates").isEmpty()) {
                return new AiExtractionResponse();
            }

            String jsonText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            jsonText = jsonText.replace("```json", "").replace("```", "").trim();

            return objectMapper.readValue(jsonText, AiExtractionResponse.class);

        } catch (Exception e) {
            System.err.println("Eroare AI (Gemini 2.5): " + e.getMessage());
            return new AiExtractionResponse();
        }
    }
}