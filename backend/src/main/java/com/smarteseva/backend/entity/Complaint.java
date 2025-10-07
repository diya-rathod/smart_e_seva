package com.smarteseva.backend.entity;

import java.time.LocalDateTime;

import com.smarteseva.backend.model.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; // Use LocalDateTime
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketId;
    private String category;
    private String description;
    private String status;
    private LocalDateTime dateRaised; // Changed to LocalDateTime
    private String location;
    private String landmark; // Added landmark
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "citizen_id") // Link to the user who raised it
    private User citizen;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    
}