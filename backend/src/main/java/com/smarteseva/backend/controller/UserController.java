package com.smarteseva.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Import

import com.smarteseva.backend.dto.ChangePasswordRequest;
import com.smarteseva.backend.dto.ComplaintResponseDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository; // Import
import com.smarteseva.backend.service.UserService;



@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

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

    @GetMapping("/complaint/{ticketId}")
    public ResponseEntity<Complaint> getComplaintByTicketId(@PathVariable String ticketId) {
        // Logged-in user ka email nikalo
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String citizenEmail = authentication.getName();

        // Complaint ko ticket ID se dhoondho
        Complaint complaint = complaintRepository.findByTicketId(ticketId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ticket ID: " + ticketId));

        // Security Check: Kya yeh complaint isi user ki hai?
        if (!complaint.getCitizen().getEmail().equals(citizenEmail)) {
            // Agar nahi, to permission deny karo
            return ResponseEntity.status(403).build();
        }

        // Agar sab theek hai, to complaint return karo
        return ResponseEntity.ok(complaint);
    }

    @PostMapping("/change-password")
       public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
           Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
           String userEmail = authentication.getName();

           try {
               userService.changePassword(userEmail, request);
               return ResponseEntity.ok("Password changed successfully");
           } catch (RuntimeException e) {
               // Simple error handling
               return ResponseEntity.badRequest().body(e.getMessage());
           }
       }

    
}