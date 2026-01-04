package com.workhive.api.services;

import com.workhive.api.dto.spaces.SpaceResponse;
import com.workhive.api.entities.Space;
import com.workhive.api.entities.SpaceType;
import com.workhive.api.repositories.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // IMPORT IMPORTANT

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;

    @Transactional(readOnly = true)
    public List<SpaceResponse> getAvailableSpaces(Integer locationId, SpaceType type, LocalDateTime start, LocalDateTime end) {

        List<Space> spaces = spaceRepository.findAvailableSpaces(
                locationId,
                type.name(),
                start,
                end
        );

        return spaces.stream()
                .map(space -> SpaceResponse.builder()
                        .id(space.getId())
                        .name(space.getName())
                        .type(space.getType().name())
                        .description(space.getDescription())
                        .resourceNames(space.getResources().stream()
                                .map(res -> res.getName())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }
}