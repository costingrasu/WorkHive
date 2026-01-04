package com.workhive.api.dto.admin;

import lombok.Data;

@Data
public class ParkingCreateDTO {
    private Integer locationId;
    private Integer spotNumber;
}