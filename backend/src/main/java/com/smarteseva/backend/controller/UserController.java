package com.smarteseva.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Import

import com.smarteseva.backend.dto.ComplaintResponseDTO; // Import
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository; // <-- NEW: Import Complaint Entity



@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;
    // This endpoint will return the details of the currently logged-in user
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserDetails() {
        // Get the currently logged-in user's email from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // Find the user in the database and return their details
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // We are returning the full User object for now.
        // In a real app, we would use a DTO to avoid sending the password.
        return ResponseEntity.ok(user);
    }

    @GetMapping("/my-complaints") // FIX: The missing API
    public ResponseEntity<List<ComplaintResponseDTO>> getMyComplaints() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String citizenEmail = authentication.getName();

        // Find the citizen user
        User citizen = userRepository.findByEmail(citizenEmail)
         .orElseThrow(() -> new RuntimeException("Citizen not found"));

        // Fetch complaints (Requires findByCitizen in ComplaintRepository)
        List<Complaint> complaints = complaintRepository.findByCitizen(citizen); 
        
        // Convert to DTOs for secure transfer
        List<ComplaintResponseDTO> responseDtos = complaints.stream()
         .map(ComplaintResponseDTO::fromEntity)
         .collect(Collectors.toList());

        return ResponseEntity.ok(responseDtos);
    }
}