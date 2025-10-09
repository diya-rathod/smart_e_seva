package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class AgentDTO {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private String employeeId;
    private String division;
}