package com.smarteseva.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; // Import User
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.AssignmentRequestDTO;
import com.smarteseva.backend.dto.ComplaintRequestDTO; // Import UserRepository
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository; // Import LocalDateTime
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.util.GeographicUtil;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository; // Inject UserRepository

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Autowired
    private NotificationService notificationService; // <-- Nayi service ko inject karein

    public Complaint createComplaint(ComplaintRequestDTO complaintDTO, String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("Citizen not found with email: " + citizenEmail));

        Complaint newComplaint = new Complaint();
        newComplaint.setCategory(complaintDTO.getCategory());
        newComplaint.setDescription(complaintDTO.getDescription());
        newComplaint.setLocation(complaintDTO.getLocation());
        newComplaint.setLandmark(complaintDTO.getLandmark());
        // Inside the createComplaint method, before the save() call

        newComplaint.setLatitude(complaintDTO.getLatitude());
        newComplaint.setLongitude(complaintDTO.getLongitude());
        

        newComplaint.setTicketId("TKT-" + System.currentTimeMillis());
        newComplaint.setStatus("New");
        newComplaint.setDateRaised(LocalDateTime.now());
        newComplaint.setCitizen(citizen);

        Complaint savedComplaint = complaintRepository.save(newComplaint);
        notificationService.sendNewComplaintNotification(savedComplaint);

        // return complaintRepository.save(newComplaint);

        return savedComplaint;
    }

    public Complaint getComplaintById(Long id) {
    return complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
    }

    public User findNearestAvailableAgent(Long complaintId) {
        Complaint complaint = getComplaintById(complaintId);
        double complaintLat = complaint.getLatitude();
        double complaintLon = complaint.getLongitude();

        // 1. Fetch all available Agents (ROLE_AGENT and AVAILABLE status)
        List<User> availableAgents = userRepository.findByRoleAndAvailabilityStatus("ROLE_AGENT", "AVAILABLE");

        // 2. Find the nearest one
        User nearestAgent = availableAgents.stream()
            .filter(agent -> agent.getLatitude() != null && agent.getLongitude() != null)
            .min((agent1, agent2) -> {
                double dist1 = GeographicUtil.calculateDistance(
                    complaintLat, complaintLon, agent1.getLatitude(), agent1.getLongitude()
                );
                double dist2 = GeographicUtil.calculateDistance(
                    complaintLat, complaintLon, agent2.getLatitude(), agent2.getLongitude()
                );
                return Double.compare(dist1, dist2);
            })
            .orElse(null); // Return null if no available agent is found

        return nearestAgent;
    }

    public Complaint assignAgent(AssignmentRequestDTO assignmentDTO) {
        // 1. Complaint fetch karein
        Complaint complaint = complaintRepository.findById(assignmentDTO.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + assignmentDTO.getComplaintId()));

        // 2. Agent fetch karein
        User agent = userRepository.findById(assignmentDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found with id: " + assignmentDTO.getAgentId()));

        if (!"ROLE_AGENT".equals(agent.getRole())) {
            throw new RuntimeException("User is not an Agent.");
        }
        
        // 3. Complaint update karein (B2)
        complaint.setAgent(agent);
        complaint.setStatus("In-Progress"); 
        Complaint updatedComplaint = complaintRepository.save(complaint);
        
        // 4. Agent status update karein (B3)
        agent.setAvailabilityStatus("ON_DUTY"); 
        userRepository.save(agent);
        
        // 5. Notification bhejein (B5 ka initial call)
        notificationService.sendAgentAssignmentNotification(updatedComplaint); // Nayi method call
        
        return updatedComplaint;
    }
}