package com.workhive.api.repositories;

import com.workhive.api.entities.Space;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<Space, Integer> {
}
