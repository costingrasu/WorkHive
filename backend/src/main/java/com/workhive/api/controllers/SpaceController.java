package com.workhive.api.controllers;

import com.workhive.api.dto.spaces.SpaceResponse;
import com.workhive.api.entities.SpaceType; // Importăm Enum-ul corect
import com.workhive.api.services.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping("/available")
    public ResponseEntity<List<SpaceResponse>> getAvailableSpaces(
            @RequestParam Integer locationId,
            @RequestParam SpaceType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(spaceService.getAvailableSpaces(locationId, type, start, end));
    }
}