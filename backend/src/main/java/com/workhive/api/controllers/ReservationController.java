package com.workhive.api.controllers;

import com.workhive.api.dto.reservations.ReservationRequest;
import com.workhive.api.dto.reservations.ReservationResponse;
import com.workhive.api.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "desc") String sort
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return ResponseEntity.ok(reservationService.getMyReservations(email, status, location, sort));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return ResponseEntity.ok(reservationService.createReservation(email, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelReservation(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        reservationService.cancelReservation(email, id);

        return ResponseEntity.ok("Reservation cancelled successfully.");
    }
}
