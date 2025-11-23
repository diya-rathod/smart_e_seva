package com.smarteseva.backend.dto;

import lombok.Data;

// Yeh DTO sirf woh fields lega jo Admin update kar sakta hai
@Data
public class UserUpdateRequestDTO {
    private String name;
    private String mobileNumber;
    private String meterNumber; // Citizen ke liye
    private String serviceAddress;
    private String landmark;
    
    // Agent ke liye fields
    private String employeeId; 
    private String division; 
    
    // Status (Active/Inactive) - Deactivate ke liye
    private String status; 
    private String email; // Email update karne ke liye
    private String newPassword; // Password reset ke liye (optional)
    
    // Note: Email, Password, Role yahan nahi hain, Admin inhe nahi badal sakta
}