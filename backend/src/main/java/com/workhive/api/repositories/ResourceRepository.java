package com.workhive.api.repositories;

import com.workhive.api.entities.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    @Query(value = """
        SELECT r.name as resourceName, s.name as spaceName
        FROM resources r
        JOIN space_resources sr ON r.id = sr.resource_id
        JOIN spaces s ON sr.space_id = s.id
        ORDER BY s.name
        """, nativeQuery = true)
    List<Object[]> findAllResourcesDistribution();
}
