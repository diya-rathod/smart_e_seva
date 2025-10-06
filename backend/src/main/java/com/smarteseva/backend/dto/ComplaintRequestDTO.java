package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class ComplaintRequestDTO {
    // Fields that will come from the frontend form
    private String category;
    private String description;
    private String location;
    private String landmark;
    private String meterNumber;
    private String mobileNumber;
    // We will handle photoUrl later
}