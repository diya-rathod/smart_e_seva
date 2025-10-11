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

    private Double latitude;
    private Double longitude;
    private String availabilityStatus; // ON_DUTY, AVAILABLE, etc.
    private String status; // Account status like 'Active'
    private String dob;
    private String createdBy;
}