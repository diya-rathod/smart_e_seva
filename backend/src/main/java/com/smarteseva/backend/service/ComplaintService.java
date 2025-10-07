package com.smarteseva.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; // Import User
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.ComplaintRequestDTO; // Import UserRepository
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.ComplaintRepository; // Import LocalDateTime
import com.smarteseva.backend.repository.UserRepository;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository; // Inject UserRepository

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
        // Inside the createComplaint method, before the save() call

        newComplaint.setLatitude(complaintDTO.getLatitude());
        newComplaint.setLongitude(complaintDTO.getLongitude());
        

        newComplaint.setTicketId("TKT-" + System.currentTimeMillis());
        newComplaint.setStatus("New");
        newComplaint.setDateRaised(LocalDateTime.now());
        newComplaint.setCitizen(citizen);

        return complaintRepository.save(newComplaint);
    }
}