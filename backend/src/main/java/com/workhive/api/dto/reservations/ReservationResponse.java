package com.workhive.api.dto.reservations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Integer id;
    private String locationName;
    private String spaceName;
    private String parkingSpot;
    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
    private String notes;
}
