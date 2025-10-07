package com.smarteseva.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Complaint>> getAssignedComplaints() {
        // Get the currently logged-in agent's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String agentEmail = authentication.getName();

        // Find the agent in the database
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Fetch complaints assigned to this agent
        List<Complaint> complaints = complaintRepository.findByAgent(agent);

        return ResponseEntity.ok(complaints);
    }
}