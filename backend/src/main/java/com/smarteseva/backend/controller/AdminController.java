package com.smarteseva.backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.RegisterRequestDTO;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    newUser.setAccountStatus("Active");
    newUser.setCreatedAt(LocalDateTime.now());

    // Get the currently logged-in admin's username
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String currentAdminEmail = authentication.getName();
    newUser.setCreatedBy(currentAdminEmail);

    userRepository.save(newUser);
    return ResponseEntity.ok("Citizen registered successfully!");
    }
}