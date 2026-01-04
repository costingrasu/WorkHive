package com.workhive.api.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminSpaceDTO {
    private Integer id;
    private String name;
    private String type;
    private String locationName;
}
