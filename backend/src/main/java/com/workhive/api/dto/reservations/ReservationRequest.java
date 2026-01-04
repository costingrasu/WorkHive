package com.workhive.api.dto.reservations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {
    private Integer spaceId;
    private LocalDateTime start;
    private LocalDateTime end;
    private boolean wantsParking;
    private String notes;
}
