package com.smarteseva.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
@CrossOrigin(origins = "http://localhost:3000") // Allows React frontend to call this API
public class ComplaintController {

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // This method will handle GET requests to http://localhost:8080/api/v1/complaints
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @PostMapping
    public Complaint createNewComplaint(@RequestBody ComplaintRequestDTO complaintDTO) {
        return complaintService.createComplaint(complaintDTO);
    }
}