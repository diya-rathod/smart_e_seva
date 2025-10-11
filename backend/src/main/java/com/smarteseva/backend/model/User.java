//backend/src/main/java/com/smarteseva/backend/model/User.java

package com.smarteseva.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

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


 @JsonIgnore // FINAL FIX 1: Password hash ko 100% block karein
 @Column(nullable = false)
 private String password;

 private String role; 

 // --- COMMON & CITIZEN FIELDS ---
 private String mobileNumber;
 
 @Column(unique = true)
 private String meterNumber;

 @JsonIgnore // FINAL FIX 2: Sensitive/Unnecessary details block karein
 private LocalDate dob;

 @JsonIgnore // FINAL FIX 3: Unnecessary details block karein
 private String serviceAddress;

 @JsonIgnore // FINAL FIX 4: Unnecessary details block karein
 private String landmark;

 private Double latitude; 
 private Double longitude; 
 private String availabilityStatus; 
 

 // --- NEW AGENT-SPECIFIC FIELDS ---
 @Column(unique = true)
 private String employeeId;

 private String division; 

 // --- SYSTEM FIELDS ---
 private String status; 

    @JsonIgnore // FINAL FIX 5: Internal audit field block karein
 private String createdBy;

    @JsonIgnore // FINAL FIX 6: Internal audit field block karein
 private LocalDateTime createdAt;
}