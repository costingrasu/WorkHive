package com.workhive.api.services;

import com.workhive.api.dto.admin.*;
import com.workhive.api.dto.locations.LocationStatsDTO;

import com.workhive.api.entities.*;

import com.workhive.api.repositories.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final ReservationRepository reservationRepository;
    private final SpaceRepository spaceRepository;
    private final ParkingRepository parkingRepository;
    private final ResourceRepository resourceRepository;

    public List<User> getInactiveUsers() {
        return userRepository.findUsersWithNoReservations();
    }

    public List<LocationStatsDTO> getTopLocations() {
        List<Object[]> results = locationRepository.findLocationsByPopularity();
        return results.stream()
                .map(row -> new LocationStatsDTO(
                        (Integer) row[0],
                        (String) row[1],
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    public List<ReservationProjection> getAllReservations() {
        return reservationRepository.findAllReservationsAdmin();
    }

    public List<AdminSpaceDTO> getSpacesReport() {
        return spaceRepository.findAllSpacesWithLocationName().stream()
                .map(row -> new AdminSpaceDTO(
                        (Integer) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3]
                ))
                .collect(Collectors.toList());
    }

    public List<AdminParkingDTO> getParkingsReport() {
        return parkingRepository.findAllParkingsWithLocationName().stream()
                .map(row -> new AdminParkingDTO(
                        (Integer) row[0],
                        (Integer) row[1],
                        (String) row[2]
                ))
                .collect(Collectors.toList());
    }

    public List<AdminResourceDTO> getResourcesReport() {
        return resourceRepository.findAllResourcesDistribution().stream()
                .map(row -> new AdminResourceDTO(
                        (Integer) row[0],
                        (String) row[1],
                        (String) row[2]
                ))
                .collect(Collectors.toList());
    }

    public void createLocation(LocationCreateDTO dto) {
        Location location = Location.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .city(dto.getCity())
                .floor(dto.getFloor())
                .build();
        locationRepository.save(location);
    }

    public void deleteLocation(Integer id) {
        locationRepository.deleteById(id);
    }

    public void createResource(ResourceCreateDTO dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        resourceRepository.save(resource);
    }

    public void deleteResource(Integer id) {
        resourceRepository.deleteById(id);
    }

    public void createParking(ParkingCreateDTO dto) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Parking parking = Parking.builder()
                .location(location)
                .spotNumber(dto.getSpotNumber())
                .available(true)
                .build();
        parkingRepository.save(parking);
    }

    public void deleteParking(Integer id) {
        parkingRepository.deleteById(id);
    }

    public void createSpace(SpaceCreateDTO dto) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        List<Integer> ids = dto.getResourceIds() != null ? dto.getResourceIds() : List.of();

        List<Resource> selectedResources = resourceRepository.findAllById(ids);

        if (selectedResources.size() != ids.size()) {
            throw new IllegalArgumentException("One or more Resource IDs are invalid.");
        }

        Space space = Space.builder()
                .name(dto.getName())
                .location(location)
                .type(SpaceType.valueOf(dto.getType()))
                .description(dto.getDescription())
                .available(true)
                .resources(new HashSet<>(selectedResources))
                .build();

        spaceRepository.save(space);
    }

    public void deleteSpace(Integer id) {
        spaceRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public void deleteReservation(Integer id) {
        reservationRepository.deleteById(id);
    }

    public void updateLocation(Integer id, LocationCreateDTO dto) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setName(dto.getName());
        location.setCity(dto.getCity());
        location.setAddress(dto.getAddress());
        location.setFloor(dto.getFloor());

        locationRepository.save(location);
    }

    public void updateResource(Integer id, ResourceCreateDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());

        resourceRepository.save(resource);
    }

    public void updateParking(Integer id, ParkingCreateDTO dto) {
        Parking parking = parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking not found"));

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        parking.setSpotNumber(dto.getSpotNumber());
        parking.setLocation(location);

        parkingRepository.save(parking);
    }

    public void updateSpace(Integer id, SpaceCreateDTO dto) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        space.setName(dto.getName());
        space.setType(SpaceType.valueOf(dto.getType()));
        space.setDescription(dto.getDescription());
        space.setLocation(location);

        if (dto.getResourceIds() != null) {
            List<Resource> resources = resourceRepository.findAllById(dto.getResourceIds());
            space.setResources(new HashSet<>(resources));
        }

        spaceRepository.save(space);
    }
}