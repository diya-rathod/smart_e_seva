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
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.ComplaintResponseDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/agent")
@CrossOrigin(origins = "http://localhost:3000")
public class AgentController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-complaints")
    public ResponseEntity<List<ComplaintResponseDTO>> getAssignedComplaints() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String agentEmail = authentication.getName();

    User agent = userRepository.findByEmail(agentEmail)
            .orElseThrow(() -> new RuntimeException("Agent not found"));

    // 1. Database se poori Complaint entities get karein
    List<Complaint> complaints = complaintRepository.findByAgent(agent);
    
    // 2. Un sabhi entities ko hamare "safe" DTOs mein convert karein
    List<ComplaintResponseDTO> responseDtos = complaints.stream()
            .map(ComplaintResponseDTO::fromEntity)
            .collect(Collectors.toList());

    return ResponseEntity.ok(responseDtos);
    }
}