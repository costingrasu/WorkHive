package com.workhive.api.services;

import com.workhive.api.dto.locations.LocationDTO;
import com.workhive.api.repositories.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationDTO> getAllLocations() {
        List<Object[]> results = locationRepository.findAllLocationsWithCountNative();

        return results.stream()
                .map(row -> new LocationDTO(
                        (Integer) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        ((Number) row[5]).longValue()
                ))
                .collect(Collectors.toList());
    }
}
