package com.smarteseva.backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.AgentResponseDTO;
import com.smarteseva.backend.dto.AssignmentRequestDTO;
import com.smarteseva.backend.dto.ComplaintResponseDTO;
import com.smarteseva.backend.dto.RegisterAdminRequestDTO;
import com.smarteseva.backend.dto.RegisterAgentRequestDTO;
import com.smarteseva.backend.dto.RegisterRequestDTO;
import com.smarteseva.backend.dto.UserStatusUpdateDTO;
import com.smarteseva.backend.dto.UserUpdateRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.service.ComplaintService;
import com.smarteseva.backend.service.UserService;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService; 

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

        newAgent.setLatitude(registerRequest.getLatitude());
        newAgent.setLongitude(registerRequest.getLongitude());
        newAgent.setAvailabilityStatus(registerRequest.getAvailabilityStatus());

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

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponseDTO> getComplaintById(@PathVariable Long id) {
        // 1. Service se poori Complaint entity get karein
        Complaint complaint = complaintService.getComplaintById(id);

        // 2. Us entity ko hamare "safe" DTO mein convert karein
        ComplaintResponseDTO responseDto = ComplaintResponseDTO.fromEntity(complaint);

        // 3. Frontend ko sirf "safe" DTO bhejein
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        // We can add more filtering here later (e.g., for "Active" status)
        List<User> agents = userRepository.findByRole("ROLE_AGENT");
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/nearest-agent/{complaintId}")
    // FIX 1: Return type ko User se AgentResponseDTO mein change karein
    public ResponseEntity<AgentResponseDTO> getNearestAgent(@PathVariable Long complaintId) {
        User nearestAgent = complaintService.findNearestAvailableAgent(complaintId);

        // Agar koi available agent nahi mila
        if (nearestAgent == null) {
            return ResponseEntity.notFound().build();
        }

        // FIX 2: User entity ko DTO mein convert karke return karein
        AgentResponseDTO responseDto = AgentResponseDTO.fromEntity(nearestAgent);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/assign-agent")
    public ResponseEntity<Complaint> assignAgentToComplaint(@RequestBody AssignmentRequestDTO assignmentDTO) {
        Complaint updatedComplaint = complaintService.assignAgent(assignmentDTO);
        return ResponseEntity.ok(updatedComplaint);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam String role) {
        // Check karo ki role valid hai ya nahi (optional but good practice)
        if (!role.equals("ROLE_CITIZEN") && !role.equals("ROLE_AGENT") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.badRequest().build();
        }

        // UserRepository se findByRole method ko call karo
        List<User> users = userRepository.findByRole(role);

        // Users ki list ko return karo
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            // Sensitive info hide karne ke liye DTO use karna behtar hai,
            // lekin abhi ke liye User object return kar rahe hain
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- YEH BHI NAYA ENDPOINT ADD KARO (Update User by ID) ---
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequestDTO updateRequest) {
        try {
            User updatedUser = userService.updateUser(id, updateRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            // Agar user na mile ya koi aur error ho
            return ResponseEntity.status(404).body(e.getMessage()); 
        } catch (Exception e) {
            // Doosre unexpected errors ke liye
            return ResponseEntity.status(500).body("An error occurred while updating the user.");
        }
    }
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody UserStatusUpdateDTO statusUpdateDTO) {
        try {
            User updatedUser = userService.updateUserStatus(id, statusUpdateDTO.getStatus());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}