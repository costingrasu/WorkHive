package com.workhive.api.repositories;

import com.workhive.api.entities.Parking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<Parking, Integer> {
}
