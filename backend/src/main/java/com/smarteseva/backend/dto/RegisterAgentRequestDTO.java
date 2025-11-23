//RegisterAgentRequestDTO.java (Final Updated Code)

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
    private String status; // <-- Keep for Account Status (e.g., "Active", "Inactive")
    private String division; // Service Area
    
    // --- LOCATION AND AVAILABILITY ---
    private Double latitude; 
    private Double longitude;
    private String availabilityStatus; // <-- For Assignment Logic (e.g., "AVAILABLE", "ON_DUTY")
}