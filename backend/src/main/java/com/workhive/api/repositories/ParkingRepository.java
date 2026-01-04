package com.workhive.api.repositories;

import com.workhive.api.entities.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ParkingRepository extends JpaRepository<Parking, Integer> {
    @Query(value = """
        SELECT * FROM parkings p
        WHERE p.location_id = :locationId
        AND p.available = true
        AND p.id NOT IN (
            SELECT r.parking_id FROM reservations r
            WHERE r.parking_id IS NOT NULL
            AND r.status != 'CANCELLED'
            AND (
                (r.start_time < :endTime) AND (r.end_time > :startTime)
            )
        )
        LIMIT 1
        """, nativeQuery = true)
    Optional<Parking> findFirstAvailableSpot(
            @Param("locationId") Integer locationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
