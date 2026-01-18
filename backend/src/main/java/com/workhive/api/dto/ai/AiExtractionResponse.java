package com.workhive.api.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiExtractionResponse {
    private String locationName;
    private String spaceType;
    private String startTime;
    private String endTime;
}