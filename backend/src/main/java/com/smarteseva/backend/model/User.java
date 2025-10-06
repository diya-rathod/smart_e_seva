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

    private String role; // e.g., "ROLE_ADMIN", "ROLE_CITIZEN"

    // --- NEW FIELDS ---
    private String mobileNumber;
    
    @Column(unique = true)
    private String meterNumber;

    private LocalDate dob; // Date of Birth

    private String serviceAddress; // For simplicity, we keep the address as a single string for now

    private String landmark;

    private String accountStatus; // e.g., "Active", "Inactive"

    private String createdBy; // Admin who created this user

    private LocalDateTime createdAt;
}