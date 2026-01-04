package com.workhive.api.dto.admin;

import lombok.Data;
import java.util.List; // Important

@Data
public class SpaceCreateDTO {
    private String name;
    private Integer locationId;
    private String type;
    private String description;
    private List<Integer> resourceIds;
}