package com.smarteseva.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message; // e.g., "New Complaint Assigned"

    @Column(nullable = false)
    private Long recipientId; // User/Agent ka ID (jo User.java me Long id hai)

    private String type; // "INFO", "ALERT", "SUCCESS"

    private boolean isRead = false; // "Red Dot" logic ke liye

    private LocalDateTime timestamp = LocalDateTime.now();
}