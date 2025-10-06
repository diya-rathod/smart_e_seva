package com.smarteseva.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.ComplaintRequestDTO;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.repository.ComplaintRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public List<Complaint> getAllComplaints() {
        // This method simply asks the repository to find all complaints in the database
        return complaintRepository.findAll();
    }

    // Inside ComplaintService.java class

    public Complaint createComplaint(ComplaintRequestDTO complaintDTO) {
        // This is where we would normally save to the database.
        // For now, we will just create a new Complaint object and return it
        // to simulate a successful save.
        
        Complaint newComplaint = new Complaint();
        newComplaint.setCategory(complaintDTO.getCategory());
        newComplaint.setDescription(complaintDTO.getDescription());
        newComplaint.setLocation(complaintDTO.getLocation());
        newComplaint.setTicketId("TKT-DUMMY-004"); // Dummy Ticket ID
        newComplaint.setStatus("New"); // Default status
        newComplaint.setDateRaised("2025-10-05"); // Dummy date

        // In the future, we will do: complaintRepository.save(newComplaint);
        
        return newComplaint;
    }

    // We will add more methods here later (e.g., createComplaint, getComplaintById)
}