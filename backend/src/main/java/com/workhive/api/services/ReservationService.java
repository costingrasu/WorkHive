package com.workhive.api.services;

import com.workhive.api.dto.reservations.ReservationResponse;
import com.workhive.api.repositories.ReservationProjection;
import com.workhive.api.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public List<ReservationResponse> getMyReservations(String userEmail) {
        List<ReservationProjection> projections = reservationRepository.findReservationByUserEmail(userEmail);

        return projections.stream()
                .map(p -> ReservationResponse.builder()
                        .id(p.getId())
                        .locationName(p.getLocationName())
                        .spaceName(p.getSpaceName())
                        .parkingSpot(p.getParkingSpot() != null ? "Locul " + p.getParkingSpot() : "Fara parcare")
                        .start(p.getStartTime())
                        .end(p.getEndTime())
                        .status(p.getStatus())
                        .notes(p.getNotes())
                        .build())
                .collect(Collectors.toList());
    }
}
