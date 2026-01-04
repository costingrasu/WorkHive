package com.workhive.api.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminParkingDTO {
    private Integer id;
    private Integer spotNumber;
    private String locationName;
}
