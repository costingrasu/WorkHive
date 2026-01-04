package com.workhive.api.dto.admin;

import lombok.Data;

@Data
public class LocationCreateDTO {
    private String name;
    private String address;
    private String city;
    private String floor;
}
