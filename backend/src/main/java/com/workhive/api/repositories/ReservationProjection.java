package com.workhive.api.repositories;

import java.time.LocalDateTime;

public interface ReservationProjection {
    Integer getId();
    String getLocationName();
    String getSpaceName();
    String getParkingSpot();
    LocalDateTime getStartTime();
    LocalDateTime getEndTime();
    String getStatus();
    String getNotes();
}
