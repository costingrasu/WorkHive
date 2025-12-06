package com.workhive.api.controllers;

import com.workhive.api.dto.reservations.ReservationResponse;
import com.workhive.api.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        Authentication authentification = SecurityContextHolder.getContext().getAuthentication();
        String email = authentification.getName();

        return ResponseEntity.ok(reservationService.getMyReservations(email));
    }
}
