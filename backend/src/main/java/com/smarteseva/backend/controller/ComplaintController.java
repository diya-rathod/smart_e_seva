package com.smarteseva.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.ComplaintRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.service.ComplaintService;

@RestController
@RequestMapping("/api/v1/complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // This is the endpoint for citizens to get their own complaints
    @GetMapping
    public List<Complaint> getMyComplaints() {
        // We will implement this logic later
        return List.of(); 
    }

    // This is the endpoint for a citizen to raise a new complaint
    @PostMapping
    public ResponseEntity<Complaint> createNewComplaint(@RequestBody ComplaintRequestDTO complaintDTO) {
        // Get the currently logged-in user's email from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String citizenEmail = authentication.getName();

        Complaint createdComplaint = complaintService.createComplaint(complaintDTO, citizenEmail);
        return ResponseEntity.ok(createdComplaint);
    }
}