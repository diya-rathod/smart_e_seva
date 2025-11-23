package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;
    private String dob; // We'll take date as a string from frontend
    private String mobileNumber;
    private String meterNumber;
    private String serviceAddress;
    private String landmark;
}