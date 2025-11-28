// package com.smarteseva.backend.service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Random;

// import org.springframework.beans.factory.annotation.Autowired; // Import User
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Service;

// import com.smarteseva.backend.dto.AssignmentRequestDTO;
// import com.smarteseva.backend.dto.ComplaintRequestDTO; // Import UserRepository
// import com.smarteseva.backend.entity.Complaint;
// import com.smarteseva.backend.model.User;
// import com.smarteseva.backend.repository.ComplaintRepository; // Import LocalDateTime
// import com.smarteseva.backend.repository.UserRepository;
// import com.smarteseva.backend.util.GeographicUtil;

// @Service
// public class ComplaintService {

//     @Autowired
//     private ComplaintRepository complaintRepository;

//     @Autowired
//     private UserRepository userRepository; // Inject UserRepository

//     public List<Complaint> getAllComplaints() {
//         return complaintRepository.findAll();
//     }

//     @Autowired
//     private NotificationService notificationService; // <-- Nayi service ko inject karein

//     public Complaint createComplaint(ComplaintRequestDTO complaintDTO, String citizenEmail) {
//         User citizen = userRepository.findByEmail(citizenEmail)
//                 .orElseThrow(() -> new RuntimeException("Citizen not found with email: " + citizenEmail));

//         Complaint newComplaint = new Complaint();
//         newComplaint.setCategory(complaintDTO.getCategory());
//         newComplaint.setDescription(complaintDTO.getDescription());
//         newComplaint.setLocation(complaintDTO.getLocation());
//         newComplaint.setLandmark(complaintDTO.getLandmark());
//         // Inside the createComplaint method, before the save() call

//         newComplaint.setLatitude(complaintDTO.getLatitude());
//         newComplaint.setLongitude(complaintDTO.getLongitude());
        

//         newComplaint.setTicketId("TKT-" + System.currentTimeMillis());
//         newComplaint.setStatus("New");
//         newComplaint.setDateRaised(LocalDateTime.now());
//         newComplaint.setCitizen(citizen);

//         Complaint savedComplaint = complaintRepository.save(newComplaint);
//         notificationService.sendNewComplaintNotification(savedComplaint);

//         // return complaintRepository.save(newComplaint);

//         return savedComplaint;
//     }

//     public Complaint getComplaintById(Long id) {
//     return complaintRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
//     }

//     public User findNearestAvailableAgent(Long complaintId) {
//         Complaint complaint = getComplaintById(complaintId);
//         double complaintLat = complaint.getLatitude();
//         double complaintLon = complaint.getLongitude();

//         // 1. Fetch all available Agents (ROLE_AGENT and AVAILABLE status)
//         List<User> availableAgents = userRepository.findByRoleAndAvailabilityStatus("ROLE_AGENT", "AVAILABLE");

//         // 2. Find the nearest one
//         User nearestAgent = availableAgents.stream()
//             .filter(agent -> agent.getLatitude() != null && agent.getLongitude() != null)
//             .min((agent1, agent2) -> {
//                 double dist1 = GeographicUtil.calculateDistance(
//                     complaintLat, complaintLon, agent1.getLatitude(), agent1.getLongitude()
//                 );
//                 double dist2 = GeographicUtil.calculateDistance(
//                     complaintLat, complaintLon, agent2.getLatitude(), agent2.getLongitude()
//                 );
//                 return Double.compare(dist1, dist2);
//             })
//             .orElse(null); // Return null if no available agent is found

//         return nearestAgent;
//     }

//     public Complaint assignAgent(AssignmentRequestDTO assignmentDTO) {
//         // 1. Complaint fetch karein
//         Complaint complaint = complaintRepository.findById(assignmentDTO.getComplaintId())
//                 .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + assignmentDTO.getComplaintId()));

//         // 2. Agent fetch karein
//         User agent = userRepository.findById(assignmentDTO.getAgentId())
//                 .orElseThrow(() -> new RuntimeException("Agent not found with id: " + assignmentDTO.getAgentId()));

//         if (!"ROLE_AGENT".equals(agent.getRole())) {
//             throw new RuntimeException("User is not an Agent.");
//         }
        
//         // 3. Complaint update karein (B2)
//         complaint.setAgent(agent);
//         complaint.setStatus("In-Progress"); 
//         Complaint updatedComplaint = complaintRepository.save(complaint);
        
//         // 4. Agent status update karein (B3)
//         agent.setAvailabilityStatus("ON_DUTY"); 
//         userRepository.save(agent);
        
//         // 5. Notification bhejein (B5 ka initial call)
//         notificationService.sendAgentAssignmentNotification(updatedComplaint); // Nayi method call
        
//         return updatedComplaint;
//     }


//     public Complaint getAssignedComplaintById(Long complaintId, String agentEmail) {
//         Complaint complaint = complaintRepository.findById(complaintId)
//                 .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
//         // Security Check: Ensure that the complaint is assigned to this agent
//         // Agar Agent set nahi hai ya email match nahi karta, toh unauthorized error
//         if (complaint.getAgent() == null || !complaint.getAgent().getEmail().equals(agentEmail)) {
//             throw new RuntimeException("Forbidden: Complaint not assigned to your account or details unavailable.");
//         }
        
//         return complaint;
//     }


//     @Scheduled(fixedRate = 300000) // 300000 milliseconds = 5 minutes
//     public void autoUpdateAssignedToInProgress() {
//         // Query to find all complaints with status 'Assigned'
//         // Assuming you have a ComplaintRepository method findByStatus(String status)
        
//         List<Complaint> assignedComplaints = complaintRepository.findByStatus("Assigned"); 
        
//         for (Complaint complaint : assignedComplaints) {
//             // Logic: Agar complaint ko ek specific time (e.g., 5 mins) se zyada ho gaya hai 
//             // aur woh abhi bhi 'Assigned' hai, toh usse 'In-Progress' kar do.
//             // Simple approach: Sabhi 'Assigned' ko 'In-Progress' kar do
            
//             complaint.setStatus("In-Progress");
//             // complaintRepository.setVerificationCode("000000"); // Optional: dummy code set kar do
            
//             complaintRepository.save(complaint);
            
//             // Optional: Admin ko notification bhejo ki status change hua
//             // notificationService.sendStatusUpdateNotification(complaint); 
//         }
//     }

//     public String generateVerificationCode(Long complaintId) {
//         Complaint complaint = complaintRepository.findById(complaintId)
//                 .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
//         // 1. Code Generate karein
//         Random random = new Random();
//         String code = String.format("%06d", random.nextInt(1000000)); 
        
//         // 2. Complaint Entity mein save karein
//         complaint.setVerificationCode(code);
//         Complaint savedComplaint = complaintRepository.save(complaint);
        
//         // 3. Citizen ko SSE se code bhejein
//         notificationService.sendVerificationCodeToCitizen(savedComplaint);
        
//         return code; // Agent ko confirmation ke liye code return karein
//     }

//     // --- NEW METHOD: Status Update Verification (Final Resolve) ---
//     public Complaint verifyAndResolveComplaint(Long complaintId, String code) {
//         // ... (existing verifyAndCloseComplaint logic ko yahan use karein, 
//         // sirf status ko "Resolved" set karein)
//         Complaint complaint = complaintRepository.findById(complaintId)
//                 .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
//         // 1. Status Check: Sirf In-Progress se hi Resolve ho sakta hai
//         if (!complaint.getStatus().equals("In-Progress")) {
//             throw new RuntimeException("Complaint must be In-Progress to resolve.");
//         }
        
//         // 2. Code Check (Security)
//         if (!complaint.getVerificationCode().equals(code)) {
//             throw new RuntimeException("Invalid verification code.");
//         }

//         // 3. Final Status Update
//         complaint.setStatus("Resolved"); // Final Status
//         complaint.setVerificationCode(null); // Code clear karein
//         Complaint resolvedComplaint = complaintRepository.save(complaint);
        
//         // 4. Agent Status Final Update
//         User agent = resolvedComplaint.getAgent();
//         if (agent != null) {
//             agent.setAvailabilityStatus("AVAILABLE");
//             userRepository.save(agent);
//         }

//         return resolvedComplaint;
//     }

//     public Complaint updateComplaintStatusSimple(Long complaintId, String newStatus, String agentEmail) {
        
//         Complaint complaint = complaintRepository.findById(complaintId)
//                 .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
//         // Security Check: Ensure that the complaint is assigned to this agent
//         if (complaint.getAgent() == null || !complaint.getAgent().getEmail().equals(agentEmail)) {
//             throw new RuntimeException("Forbidden: Complaint not assigned to your account.");
//         }

//         // Logic: Sirf 'In-Progress' ya 'Assigned' hi set karne ki permission denge (agar resolved nahi hai)
//         if (newStatus.equals("In-Progress")) {
//             complaint.setStatus(newStatus);
//         } else {
//             // Agar Agent 'Resolved' ya koi aur status bheje, toh error (Resolved ke liye verify-resolve API hai)
//             throw new RuntimeException("Invalid status transition via this API.");
//         }
        
//         Complaint updatedComplaint = complaintRepository.save(complaint);
        
//         // Optional: Admin/Citizen ko notification bhejein
//         // notificationService.sendComplaintStatusUpdate(updatedComplaint);

//         return updatedComplaint;
//     }

// }










package com.smarteseva.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.AssignmentRequestDTO;
import com.smarteseva.backend.dto.ComplaintRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.util.GeographicUtil;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint createComplaint(ComplaintRequestDTO complaintDTO, String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("Citizen not found with email: " + citizenEmail));

        Complaint newComplaint = new Complaint();
        newComplaint.setCategory(complaintDTO.getCategory());
        newComplaint.setDescription(complaintDTO.getDescription());
        newComplaint.setLocation(complaintDTO.getLocation());
        newComplaint.setLandmark(complaintDTO.getLandmark());
        newComplaint.setLatitude(complaintDTO.getLatitude());
        newComplaint.setLongitude(complaintDTO.getLongitude());

        newComplaint.setTicketId("TKT-" + System.currentTimeMillis());
        newComplaint.setStatus("New");
        newComplaint.setDateRaised(LocalDateTime.now());
        newComplaint.setCitizen(citizen);

        Complaint savedComplaint = complaintRepository.save(newComplaint);
        
        // FIX: Admin ko notification bhejne ka logic abhi hata diya hai taaki error na aaye.
        // Agar Admin notification chahiye, to hume Admin ki ID dhundni padegi.
        // Filhal ke liye ye line comment out kar rahe hain.
        // notificationService.sendNewComplaintNotification(savedComplaint); 

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

        List<User> availableAgents = userRepository.findByRoleAndAvailabilityStatus("ROLE_AGENT", "AVAILABLE");

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
            .orElse(null);

        return nearestAgent;
    }

    public Complaint assignAgent(AssignmentRequestDTO assignmentDTO) {
        Complaint complaint = complaintRepository.findById(assignmentDTO.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + assignmentDTO.getComplaintId()));

        User agent = userRepository.findById(assignmentDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found with id: " + assignmentDTO.getAgentId()));

        if (!"ROLE_AGENT".equals(agent.getRole())) {
            throw new RuntimeException("User is not an Agent.");
        }
        
        complaint.setAgent(agent);
        complaint.setStatus("Assigned"); 
        Complaint updatedComplaint = complaintRepository.save(complaint);
        
        agent.setAvailabilityStatus("ON_DUTY"); 
        userRepository.save(agent);
        
        // FIX: Notification Service ka naya method use karein
        notificationService.sendAgentAssignmentNotification(updatedComplaint); 
        
        return updatedComplaint;
    }

    public Complaint getAssignedComplaintById(Long complaintId, String agentEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
        if (complaint.getAgent() == null || !complaint.getAgent().getEmail().equals(agentEmail)) {
            throw new RuntimeException("Forbidden: Complaint not assigned to your account or details unavailable.");
        }
        return complaint;
    }

    @Scheduled(fixedRate = 300000) 
    public void autoUpdateAssignedToInProgress() {
        List<Complaint> assignedComplaints = complaintRepository.findByStatus("Assigned"); 
        for (Complaint complaint : assignedComplaints) {
            complaint.setStatus("In-Progress");
            complaintRepository.save(complaint);
        }
    }

    public String generateVerificationCode(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
        Random random = new Random();
        String code = String.format("%06d", random.nextInt(1000000)); 
        
        complaint.setVerificationCode(code);
        Complaint savedComplaint = complaintRepository.save(complaint);
        
        // FIX: Naya method use karein
        notificationService.sendVerificationCodeToCitizen(savedComplaint);
        
        return code; 
    }

    public Complaint verifyAndResolveComplaint(Long complaintId, String code) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
        if (!complaint.getStatus().equals("In-Progress")) {
            throw new RuntimeException("Complaint must be In-Progress to resolve.");
        }
        
        if (!complaint.getVerificationCode().equals(code)) {
            throw new RuntimeException("Invalid verification code.");
        }

        complaint.setStatus("Resolved"); 
        complaint.setVerificationCode(null); 
        Complaint resolvedComplaint = complaintRepository.save(complaint);
        
        User agent = resolvedComplaint.getAgent();
        if (agent != null) {
            agent.setAvailabilityStatus("AVAILABLE");
            userRepository.save(agent);
        }

        return resolvedComplaint;
    }

    public Complaint updateComplaintStatusSimple(Long complaintId, String newStatus, String agentEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
        if (complaint.getAgent() == null || !complaint.getAgent().getEmail().equals(agentEmail)) {
            throw new RuntimeException("Forbidden: Complaint not assigned to your account.");
        }

        if (newStatus.equals("In-Progress")) {
            complaint.setStatus(newStatus);
        } else {
            throw new RuntimeException("Invalid status transition via this API.");
        }
        
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return updatedComplaint;
    }
}