package com.workhive.api.repositories;

import com.workhive.api.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {

    @Query(value = """
        SELECT 
            l.id,
            l.name,
            l.city,
            l.address,
            l.floor,
            COUNT(s.id) as totalSpaces 
        FROM locations l
        LEFT JOIN spaces s ON l.id = s.location_id
        GROUP BY l.id, l.name, l.city, l.address, l.floor
        ORDER BY l.name ASC
        """, nativeQuery = true)
    List<Object[]> findAllLocationsWithCountNative();

    @Query(value = """
        SELECT 
            l.id, 
            l.name, 
            (
                SELECT COUNT(*) 
                FROM reservations r 
                JOIN spaces s ON r.space_id = s.id 
                WHERE s.location_id = l.id
            ) as reservation_count
        FROM locations l
        ORDER BY reservation_count DESC
        """, nativeQuery = true)
    List<Object[]> findLocationsByPopularity();
}
