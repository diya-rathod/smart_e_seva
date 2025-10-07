package com.smarteseva.backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.RegisterAdminRequestDTO;
import com.smarteseva.backend.dto.RegisterAgentRequestDTO;
import com.smarteseva.backend.dto.RegisterRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.service.ComplaintService;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Inside AdminController.java

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterAdminRequestDTO registerRequest) {
    // Check if email already exists
    if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
        return ResponseEntity.status(400).body("Error: Email is already in use!");
    }

    // --- NEW: DOB Validation for 18+ ---
    LocalDate dob = LocalDate.parse(registerRequest.getDob());
    if (Period.between(dob, LocalDate.now()).getYears() < 18) {
        return ResponseEntity.status(400).body("Error: Admin must be at least 18 years old.");
    }

    User newAdmin = new User();
    newAdmin.setName(registerRequest.getName());
    newAdmin.setEmail(registerRequest.getEmail());
    newAdmin.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    newAdmin.setMobileNumber(registerRequest.getMobileNumber());
    newAdmin.setDob(dob);
    newAdmin.setServiceAddress(registerRequest.getAddress()); // Use the serviceAddress field for address

    // Set system-managed fields
    newAdmin.setRole("ROLE_ADMIN");
    newAdmin.setStatus("Active");
    newAdmin.setCreatedAt(LocalDateTime.now());
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    newAdmin.setCreatedBy(authentication.getName());

    userRepository.save(newAdmin);
    return ResponseEntity.ok("Admin user registered successfully!");
    }

    @PostMapping("/register-citizen")
    public ResponseEntity<?> registerCitizen(@RequestBody RegisterRequestDTO registerRequest) {
    if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
        return ResponseEntity.status(400).body("Error: Email is already in use!");
    }

    User newUser = new User();
    newUser.setName(registerRequest.getName());
    newUser.setEmail(registerRequest.getEmail());
    newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    newUser.setMobileNumber(registerRequest.getMobileNumber());
    newUser.setMeterNumber(registerRequest.getMeterNumber());
    newUser.setServiceAddress(registerRequest.getServiceAddress());
    newUser.setLandmark(registerRequest.getLandmark());
    
    // Convert String date from DTO to LocalDate
    if (registerRequest.getDob() != null) {
        newUser.setDob(LocalDate.parse(registerRequest.getDob()));
    }

    // Set system-managed fields
    newUser.setRole("ROLE_CITIZEN");
    newUser.setStatus("Active");
    newUser.setCreatedAt(LocalDateTime.now());

    // Get the currently logged-in admin's username
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String currentAdminEmail = authentication.getName();
    newUser.setCreatedBy(currentAdminEmail);

    userRepository.save(newUser);
    return ResponseEntity.ok("Citizen registered successfully!");
    }

    @PostMapping("/register-agent")
    public ResponseEntity<?> registerAgent(@RequestBody RegisterAgentRequestDTO registerRequest) {
    // Check if email already exists
    if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
        return ResponseEntity.status(400).body("Error: Email is already in use!");
    }

    // DOB Validation for 18+
    LocalDate dob = LocalDate.parse(registerRequest.getDob());
    if (Period.between(dob, LocalDate.now()).getYears() < 18) {
        return ResponseEntity.status(400).body("Error: Agent must be at least 18 years old.");
    }

    User newAgent = new User();
    newAgent.setName(registerRequest.getName());
    newAgent.setEmail(registerRequest.getEmail());
    newAgent.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    newAgent.setMobileNumber(registerRequest.getMobileNumber());
    newAgent.setDob(dob);
    
    // Set Agent-specific fields
    newAgent.setEmployeeId(registerRequest.getEmployeeId());
    newAgent.setDivision(registerRequest.getDivision());
    newAgent.setStatus(registerRequest.getStatus());

    newAgent.setRole("ROLE_AGENT"); // Set the role to AGENT

    // Set audit fields
    newAgent.setCreatedAt(LocalDateTime.now());
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    newAgent.setCreatedBy(authentication.getName());

    userRepository.save(newAgent);
    return ResponseEntity.ok("Agent registered successfully!");
    }

    @GetMapping("/all-complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
    List<Complaint> complaints = complaintService.getAllComplaints();
    return ResponseEntity.ok(complaints);
}
}