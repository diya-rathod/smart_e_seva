package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class RegisterAdminRequestDTO {
    private String name;
    private String email;
    private String password;
    private String mobileNumber;
    private String dob; // Date of Birth as a String (e.g., "1990-01-15")
    private String address; // Optional
}