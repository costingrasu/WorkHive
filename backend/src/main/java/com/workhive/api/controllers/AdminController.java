package com.workhive.api.controllers;

import com.workhive.api.dto.admin.*;
import com.workhive.api.dto.locations.LocationStatsDTO;
import com.workhive.api.entities.User;
import com.workhive.api.repositories.ReservationProjection;
import com.workhive.api.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/inactive-users")
    public ResponseEntity<List<User>> getInactiveUsers() {
        return ResponseEntity.ok(adminService.getInactiveUsers());
    }

    @GetMapping("/top-locations")
    public ResponseEntity<List<LocationStatsDTO>> getTopLocations() {
        return ResponseEntity.ok(adminService.getTopLocations());
    }

    @GetMapping("/all-reservations")
    public ResponseEntity<List<ReservationProjection>> getAllReservations() {
        return ResponseEntity.ok(adminService.getAllReservations());
    }

    @GetMapping("/spaces-report")
    public ResponseEntity<List<AdminSpaceDTO>> getSpacesReport() {
        return ResponseEntity.ok(adminService.getSpacesReport());
    }

    @GetMapping("/parkings-report")
    public ResponseEntity<List<AdminParkingDTO>> getParkingsReport() {
        return ResponseEntity.ok(adminService.getParkingsReport());
    }

    @GetMapping("/resources-report")
    public ResponseEntity<List<AdminResourceDTO>> getResourcesReport() {
        return ResponseEntity.ok(adminService.getResourcesReport());
    }

    @PostMapping("/locations")
    public ResponseEntity<String> createLocation(@RequestBody LocationCreateDTO dto) {
        adminService.createLocation(dto);
        return ResponseEntity.ok("Location created");
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable Integer id) {
        adminService.deleteLocation(id);
        return ResponseEntity.ok("Location deleted");
    }

    @PostMapping("/resources")
    public ResponseEntity<String> createResource(@RequestBody ResourceCreateDTO dto) {
        adminService.createResource(dto);
        return ResponseEntity.ok("Resource created");
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable Integer id) {
        adminService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted");
    }

    @PostMapping("/parkings")
    public ResponseEntity<String> createParking(@RequestBody ParkingCreateDTO dto) {
        adminService.createParking(dto);
        return ResponseEntity.ok("Parking created");
    }

    @DeleteMapping("/parkings/{id}")
    public ResponseEntity<String> deleteParking(@PathVariable Integer id) {
        adminService.deleteParking(id);
        return ResponseEntity.ok("Parking deleted");
    }

    @PostMapping("/spaces")
    public ResponseEntity<String> createSpace(@RequestBody SpaceCreateDTO dto) {
        adminService.createSpace(dto);
        return ResponseEntity.ok("Space created");
    }

    @DeleteMapping("/spaces/{id}")
    public ResponseEntity<String> deleteSpace(@PathVariable Integer id) {
        adminService.deleteSpace(id);
        return ResponseEntity.ok("Space deleted");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Integer id) {
        adminService.deleteReservation(id);
        return ResponseEntity.ok("Reservation deleted");
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<String> updateLocation(@PathVariable Integer id, @RequestBody LocationCreateDTO dto) {
        adminService.updateLocation(id, dto);
        return ResponseEntity.ok("Location updated");
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<String> updateResource(@PathVariable Integer id, @RequestBody ResourceCreateDTO dto) {
        adminService.updateResource(id, dto);
        return ResponseEntity.ok("Resource updated");
    }

    @PutMapping("/parkings/{id}")
    public ResponseEntity<String> updateParking(@PathVariable Integer id, @RequestBody ParkingCreateDTO dto) {
        adminService.updateParking(id, dto);
        return ResponseEntity.ok("Parking updated");
    }

    @PutMapping("/spaces/{id}")
    public ResponseEntity<String> updateSpace(@PathVariable Integer id, @RequestBody SpaceCreateDTO dto) {
        adminService.updateSpace(id, dto);
        return ResponseEntity.ok("Space updated");
    }
}