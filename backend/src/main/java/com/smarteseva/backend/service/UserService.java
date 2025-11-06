package com.smarteseva.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Complaint ko import karo
import org.springframework.security.crypto.password.PasswordEncoder; // ComplaintRepository ko import karo
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.AgentLocationUpdateDTO;
import com.smarteseva.backend.dto.ChangePasswordRequest;
import com.smarteseva.backend.dto.UserUpdateRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Yeh SecurityConfig se aayega

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Yeh "messenger" hai

    @Autowired
    private ComplaintRepository complaintRepository; // Complaint dhoondhne ke liye

    public void changePassword(String userEmail, ChangePasswordRequest request) {

        // 1. User ko database se dhoondho
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Purana password check karo
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            // Agar match nahi hua, to error do
            throw new RuntimeException("Incorrect current password");
        }

        // 3. Naya aur confirm password check karo
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // 4. Sab theek hai, to naya password encode karke save karo
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // --- YEH BHI NAYA FUNCTION ADD KARO (Update User) ---
    public User updateUser(Long id, UserUpdateRequestDTO updateRequest) {
        // Pehle user ko dhoondho
        User existingUser = getUserById(id);

        // 1. Email Update Logic (Agar DTO mein email hai aur purane se alag hai)
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equalsIgnoreCase(existingUser.getEmail())) {
            // Check karo ki naya email pehle se use mein to nahi hai
            if (userRepository.findByEmail(updateRequest.getEmail()).isPresent()) {
                throw new RuntimeException("Error: Email " + updateRequest.getEmail() + " is already in use!");
            }
            existingUser.setEmail(updateRequest.getEmail());
        }

        // 2. Password Reset Logic (Agar DTO mein newPassword hai)
        if (updateRequest.getNewPassword() != null && !updateRequest.getNewPassword().isEmpty()) {
            // Naye password ko encode karke set karo
            existingUser.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
            // Password reset hone par, user ko dobara change karne ke liye force karo
            // (Optional)
            // existingUser.setMustChangePassword(true);
        }

        // 3. Baaki ke fields update karo (jaisa pehle tha)
        if (updateRequest.getName() != null) {
            existingUser.setName(updateRequest.getName());
        }
        if (updateRequest.getMobileNumber() != null) {
            existingUser.setMobileNumber(updateRequest.getMobileNumber());
        }
        if (updateRequest.getMeterNumber() != null) {
            existingUser.setMeterNumber(updateRequest.getMeterNumber());
        }
        if (updateRequest.getServiceAddress() != null) {
            existingUser.setServiceAddress(updateRequest.getServiceAddress());
        }
        if (updateRequest.getLandmark() != null) {
            existingUser.setLandmark(updateRequest.getLandmark());
        }
        if (updateRequest.getEmployeeId() != null) {
            existingUser.setEmployeeId(updateRequest.getEmployeeId());
        }
        if (updateRequest.getDivision() != null) {
            existingUser.setDivision(updateRequest.getDivision());
        }
        if (updateRequest.getStatus() != null) {
            existingUser.setStatus(updateRequest.getStatus());
        }

        // 4. Updated user ko save karo
        return userRepository.save(existingUser);
    }

    public User updateUserStatus(Long id, String newStatus) {
        User user = getUserById(id); // Pehle se bane hue function ko use kiya

        // Naya status set karo
        user.setStatus(newStatus);

        // Save karke updated user return karo
        return userRepository.save(user);
    }

    public void updateAgentLocation(String agentEmail, AgentLocationUpdateDTO locationDTO) {
        // 1. Agent ko dhoondho
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found with email: " + agentEmail));

        if (!"ROLE_AGENT".equals(agent.getRole())) {
            throw new RuntimeException("User is not an agent.");
        }

        // 2. Nayi live location set karo
        agent.setLiveLatitude(locationDTO.getLatitude());
        agent.setLiveLongitude(locationDTO.getLongitude());
        userRepository.save(agent);

        // 3. Agent ki "In-Progress" complaint dhoondho
        // (Yeh maan rahe hain ki ek agent ek baar mein ek hi complaint par kaam kar
        // raha hai)
        Complaint activeComplaint = complaintRepository.findByAgentAndStatus(agent, "In-Progress").stream().findFirst()
                .orElse(null);

        // 4. Agar active complaint hai, to location broadcast karo
        if (activeComplaint != null) {
            // Ek saaf-suthra data object banao
            Map<String, Object> locationUpdate = new HashMap<>();
            locationUpdate.put("agentId", agent.getId());
            locationUpdate.put("lat", locationDTO.getLatitude());
            locationUpdate.put("lng", locationDTO.getLongitude());

            // Is "channel" par message bhejo: /topic/complaint/{complaintId}/location
            String topic = "/topic/complaint/" + activeComplaint.getId() + "/location";
            System.out.println("Broadcasting location to: " + topic); // Logging ke liye

            messagingTemplate.convertAndSend(topic, locationUpdate);
        }
    }
}