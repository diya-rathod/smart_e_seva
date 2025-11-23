package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class CitizenDTO {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private String meterNumber;
    private String serviceAddress;
    private String landmark;
    private String dob; // DTO mein String rakhte hain
}