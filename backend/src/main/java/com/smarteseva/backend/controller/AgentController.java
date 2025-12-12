package com.smarteseva.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.AgentLocationUpdateDTO;
import com.smarteseva.backend.dto.ComplaintResponseDTO;
import com.smarteseva.backend.dto.StatusUpdateRequestDTO;
import com.smarteseva.backend.dto.VerificationRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.service.ComplaintService; // Status DTO
import com.smarteseva.backend.service.JwtService;
import com.smarteseva.backend.service.UserService;

@RestController
@RequestMapping("/api/v1/agent")
@CrossOrigin(origins = "http://localhost:3000")
public class AgentController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;
    

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

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponseDTO> getComplaintDetails(@PathVariable Long id) {
        // Current logged-in Agent ka email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String agentEmail = authentication.getName();

        // Service se Complaint fetch karein (Security check ke saath)
        Complaint complaint = complaintService.getAssignedComplaintById(id, agentEmail);
        
        // DTO mein convert karein
        ComplaintResponseDTO responseDto = ComplaintResponseDTO.fromEntity(complaint);
        
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/generate-code/{id}")
    public ResponseEntity<String> generateVerificationCode(@PathVariable Long id) {
        String code = complaintService.generateVerificationCode(id);
        return ResponseEntity.ok("Verification code generated and sent to citizen. Code: " + code);
    }
    
    // --- NEW API 2: Verify and Resolve (Agent calls this with user's code) ---
    @PutMapping("/verify-resolve/{id}")
    public ResponseEntity<ComplaintResponseDTO> verifyAndResolveComplaint(
            @PathVariable Long id, 
            @RequestBody VerificationRequestDTO request) {
        
        Complaint updatedComplaint = complaintService.verifyAndResolveComplaint(
            id, 
            request.getCode()
        );
        
        ComplaintResponseDTO responseDto = ComplaintResponseDTO.fromEntity(updatedComplaint);
        
        return ResponseEntity.ok(responseDto);
    }


    @PutMapping("/update-status/{id}") // FIX 1: URL variable ko simple '{id}' rakhte hain
    public ResponseEntity<ComplaintResponseDTO> updateComplaintStatus(
            @PathVariable Long id, // FIX 2: Parameter ko bhi simple 'id' rakhte hain
            @RequestBody StatusUpdateRequestDTO statusRequest) {
        
        // Context se Agent Email nikalna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String agentEmail = authentication.getName();

        // Service call mein 'id' pass karein
        Complaint updatedComplaint = complaintService.updateComplaintStatusSimple(
            id, // Use 'id'
            statusRequest.getStatus(), 
            agentEmail
        );
        
        ComplaintResponseDTO responseDto = ComplaintResponseDTO.fromEntity(updatedComplaint);
        
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/location")
    public ResponseEntity<String> updateLocation(@RequestBody AgentLocationUpdateDTO locationDTO) {
        try {
            // Logged-in agent ka email nikalo
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String agentEmail = authentication.getName();

            // Service ko call karke location update karo
            userService.updateAgentLocation(agentEmail, locationDTO);
            
            return ResponseEntity.ok("Location updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- NEW: Toggle On-Duty / Off-Duty ---
    @PutMapping("/toggle-status")
    public ResponseEntity<?> toggleAgentStatus(@RequestHeader("Authorization") String token) {
        // Token se email nikala
        String email = jwtService.extractUsername(token.substring(7));
        
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Logic: Agar AVAILABLE hai to OFF_DUTY karo, warna AVAILABLE
        // Note: "AVAILABLE" matlab On Duty.
        if ("AVAILABLE".equals(agent.getAvailabilityStatus())) {
            agent.setAvailabilityStatus("OFF_DUTY");
        } else {
            agent.setAvailabilityStatus("AVAILABLE");
        }
        
        userRepository.save(agent);
        // Naya status return karo frontend ko
        return ResponseEntity.ok(Map.of("status", agent.getAvailabilityStatus()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Complaint>> getAgentJobHistory(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Sirf 'Resolved' status wale complaints lao
        List<Complaint> history = complaintRepository.findByAgentIdAndStatusOrderByDateRaisedDesc(agent.getId(), "Resolved");
        
        return ResponseEntity.ok(history);
    }
}