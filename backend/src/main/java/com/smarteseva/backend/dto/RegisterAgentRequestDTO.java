package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class RegisterAgentRequestDTO {
    
    // Personal Details
    private String name;
    private String email;
    private String password;
    private String dob; // Date of Birth as a String (e.g., "1990-01-15")
    private String mobileNumber;

    // Work Details
    private String employeeId;
    private String status; // "Active", "On-Work", "On-Leave"
    private String division; // Service Area
}