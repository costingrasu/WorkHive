package com.workhive.api.dto.locations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationStatsDTO {
    private Integer id;
    private String name;
    private Long reservationCount;
}
