package com.workhive.api.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminResourceDTO {
    private Integer id;
    private String name;
    private String spaceName;
}
