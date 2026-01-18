package com.workhive.api.controllers;

import com.workhive.api.dto.ai.AiExtractionResponse;
import com.workhive.api.services.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/extract")
    public ResponseEntity<AiExtractionResponse> extractDetails(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        return ResponseEntity.ok(aiService.extractReservationDetails(text));
    }
}