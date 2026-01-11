package com.workhive.api.services;

import com.workhive.api.dto.reservations.ReservationRequest;
import com.workhive.api.dto.reservations.ReservationResponse;
import com.workhive.api.entities.*;
import com.workhive.api.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final ParkingRepository parkingRepository;

    public List<ReservationResponse> getMyReservations(String userEmail, String statusFilter, String locationFilter, String sortOrder) {

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
                .filter(res -> {
                    if (statusFilter == null || statusFilter.isEmpty() || statusFilter.equals("ALL")) {
                        return true;
                    }
                    return res.getStatus().equalsIgnoreCase(statusFilter);
                })
                .filter(res -> {
                    if (locationFilter == null || locationFilter.isEmpty() || locationFilter.equals("ALL")) {
                        return true;
                    }
                    return res.getLocationName().equalsIgnoreCase(locationFilter);
                })
                .sorted((r1, r2) -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        return r1.getStart().compareTo(r2.getStart());
                    } else {
                        return r2.getStart().compareTo(r1.getStart());
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse createReservation(String userEmail, ReservationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Space space = spaceRepository.findById(request.getSpaceId())
                .orElseThrow(() -> new NoSuchElementException("Space not found"));

        Parking assignedParking = null;
        String parkingInfo = "Fara parcare";

        if (request.isWantsParking()) {
            assignedParking = parkingRepository.findFirstAvailableSpot(
                    space.getLocation().getId(),
                    request.getStart(),
                    request.getEnd()
            ).orElseThrow(() -> new IllegalStateException("Nu exista locuri de parcare disponibile în acest interval!"));

            parkingInfo = "Locul " + assignedParking.getSpotNumber();
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .space(space)
                .parking(assignedParking)
                .start(request.getStart())
                .end(request.getEnd())
                .status(ReservationStatus.CONFIRMED)
                .notes(request.getNotes())
                .build();

        Reservation saved = reservationRepository.save(reservation);

        return ReservationResponse.builder()
                .id(saved.getId())
                .locationName(space.getLocation().getName())
                .spaceName(space.getName())
                .parkingSpot(parkingInfo)
                .start(saved.getStart())
                .end(saved.getEnd())
                .status(saved.getStatus().name())
                .notes(saved.getNotes())
                .build();
    }

    public void cancelReservation(String userEmail, Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NoSuchElementException("Reservation not found"));

        if (!reservation.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Unauthorized: You can only cancel your own reservations.");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);
    }
}
