package com.workhive.api.repositories;

import com.workhive.api.entities.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Integer> {
    @Query(value = """
        SELECT * FROM spaces s
        WHERE s.location_id = :locationId
        AND s.type = :type
        AND s.available = true
        AND NOT EXISTS (
            SELECT 1 FROM reservations r
            WHERE r.space_id = s.id
            AND r.status != 'CANCELLED'
            AND (
                (r.start_time < :endTime) AND (r.end_time > :startTime)
            )
        )
        """, nativeQuery = true)
    List<Space> findAvailableSpaces(
            @Param("locationId") Integer locationId,
            @Param("type") String type,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
        SELECT s.id, s.name, s.type, l.name as locationName 
        FROM spaces s
        JOIN locations l ON s.location_id = l.id
        ORDER BY l.name, s.name
        """, nativeQuery = true)
    List<Object[]> findAllSpacesWithLocationName();
}
