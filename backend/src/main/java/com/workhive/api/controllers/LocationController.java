package com.workhive.api.controllers;

import com.workhive.api.dto.locations.LocationDTO;
import com.workhive.api.services.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping
    public ResponseEntity<List<LocationDTO>> findAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
}
