package com.workhive.api.dto.spaces;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceResponse {
    private Integer id;
    private String name;
    private String type;
    private String description;
    private List<String> resourceNames;
}
