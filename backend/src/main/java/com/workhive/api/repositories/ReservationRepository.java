package com.workhive.api.repositories;

import com.workhive.api.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    @Query(value = """
        SELECT 
            r.id AS id, u.email AS userEmail, l.name AS locationName, s.name AS spaceName,
            CAST(p.spot_number AS VARCHAR) AS parkingSpot,
            r.start_time AS startTime, r.end_time AS endTime, r.status AS status, r.notes AS notes
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        JOIN spaces s ON r.space_id = s.id
        JOIN locations l ON s.location_id = l.id
        LEFT JOIN parkings p ON r.parking_id = p.id
        WHERE u.email = :email
        ORDER BY r.start_time DESC
        """, nativeQuery = true)
    List<ReservationProjection> findReservationByUserEmail(@Param("email") String email);

    @Query(value = """
        SELECT 
            r.id AS id, u.email AS userEmail, l.name AS locationName, s.name AS spaceName,
            CAST(p.spot_number AS VARCHAR) AS parkingSpot,
            r.start_time AS startTime, r.end_time AS endTime, r.status AS status, r.notes AS notes
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        JOIN spaces s ON r.space_id = s.id
        JOIN locations l ON s.location_id = l.id
        LEFT JOIN parkings p ON r.parking_id = p.id
        ORDER BY r.created_at DESC
        """, nativeQuery = true)
    List<ReservationProjection> findAllReservationsAdmin();
}
