package com.smarteseva.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap; // <-- Ye Import Zaroori hai
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.entity.Notification;
import com.smarteseva.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // --- 1. Connection Logic ---
    public void addEmitter(String userEmail, SseEmitter emitter) {
        emitters.put(userEmail, emitter);
        emitter.onCompletion(() -> emitters.remove(userEmail));
        emitter.onTimeout(() -> emitters.remove(userEmail));
    }

    // --- 2. Generic Notification (DB Save + Bell Icon Alert) ---
    public void createAndSendNotification(Long recipientId, String recipientEmail, String message, String type) {
        // A. Database Save (History ke liye)
        Notification notif = new Notification();
        notif.setRecipientId(recipientId);
        notif.setMessage(message);
        notif.setType(type);
        notif.setTimestamp(LocalDateTime.now());
        notif.setRead(false);
        notificationRepository.save(notif);

        // B. Send Generic Alert (Bell Icon ke liye)
        SseEmitter emitter = emitters.get(recipientEmail);
        if (emitter != null) {
            try {
                String json = objectMapper.writeValueAsString(notif);
                // Agar assignment hai to 'agent_assigned' bhejo, varna 'notification'
                String eventName = "ASSIGNMENT".equals(type) ? "agent_assigned" : "notification";
                emitter.send(SseEmitter.event().name(eventName).data(json));
            } catch (IOException e) {
                emitters.remove(recipientEmail);
            }
        }
    }

    // --- 3. SPECIAL OTP METHOD (Yahi Miss Ho Raha Tha) ---
    public void sendVerificationCodeToCitizen(Complaint complaint) {
        if (complaint.getCitizen() == null) return;

        String email = complaint.getCitizen().getEmail();
        String code = complaint.getVerificationCode();
        String ticketId = complaint.getTicketId();

        // Step 1: DB me save karo (Taaki Bell Icon me dikhe)
        String message = "Service Complete! Your OTP is: " + code;
        createAndSendNotification(complaint.getCitizen().getId(), email, message, "OTP");

        // Step 2: Live Popup ke liye Special Data Bhejo
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                // Frontend ko ye Specific Object chahiye
                Map<String, String> otpData = new HashMap<>();
                otpData.put("ticketId", ticketId);
                otpData.put("verificationCode", code);
                
                String json = objectMapper.writeValueAsString(otpData);

                // Event name "verification_code" hi hona chahiye
                emitter.send(SseEmitter.event().name("verification_code").data(json));
                
                System.out.println("OTP Event Sent to: " + email); // Logs check karne ke liye
            } catch (IOException e) {
                emitters.remove(email);
            }
        }
    }

    // --- Agent Assignment Logic ---
    public void sendAgentAssignmentNotification(Complaint complaint) {
        if (complaint.getAgent() != null) {
            // Agent Dashboard ko data bhejo
            SseEmitter emitter = emitters.get(complaint.getAgent().getEmail());
            if (emitter != null) {
                try {
                    String json = objectMapper.writeValueAsString(complaint);
                    emitter.send(SseEmitter.event().name("agent_assigned").data(json));
                } catch (IOException e) { 
                    emitters.remove(complaint.getAgent().getEmail());
                }
            }
            
            // DB Entry
            createAndSendNotification(
                complaint.getAgent().getId(), 
                complaint.getAgent().getEmail(), 
                "New Complaint Assigned! Ticket: " + complaint.getTicketId(), 
                "ASSIGNMENT"
            );
        }
    }

    // --- Fetch Logic ---
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByTimestampDesc(userId);
    }
    
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}