package com.smarteseva.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role; 

    // --- COMMON & CITIZEN FIELDS ---
    private String mobileNumber;
    
    @Column(unique = true)
    private String meterNumber;

    private LocalDate dob;

    private String serviceAddress;

    private String landmark;

    private Double latitude; // Agent's current or registered location latitude
    private Double longitude; // Agent's current or registered location longitude
    private String availabilityStatus; // Values: "AVAILABLE", "ON_DUTY", "OFF_DUTY"
    

    // --- NEW AGENT-SPECIFIC FIELDS ---
    @Column(unique = true)
    private String employeeId;

    private String division; // Service Area for Agent

    // --- SYSTEM FIELDS ---
    private String status; // Renamed from accountStatus for consistency

    private String createdBy;

    private LocalDateTime createdAt;
}