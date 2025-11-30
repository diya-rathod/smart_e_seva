package com.smarteseva.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
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

    public void addEmitter(String userEmail, SseEmitter emitter) {
        emitters.put(userEmail, emitter);
        emitter.onCompletion(() -> emitters.remove(userEmail));
        emitter.onTimeout(() -> emitters.remove(userEmail));
    }

    // --- GENERIC NOTIFICATION (Bell Icon ke liye) ---
    public void createAndSendNotification(Long recipientId, String recipientEmail, String message, String type) {
        // 1. Save to DB
        Notification notif = new Notification();
        notif.setRecipientId(recipientId);
        notif.setMessage(message);
        notif.setType(type);
        notif.setTimestamp(LocalDateTime.now());
        notif.setRead(false);
        notificationRepository.save(notif);

        // 2. Send Live Alert
        SseEmitter emitter = emitters.get(recipientEmail);
        if (emitter != null) {
            try {
                String json = objectMapper.writeValueAsString(notif);
                // Agar assignment hai to specific event, nahi to generic 'notification'
                String eventName = "ASSIGNMENT".equals(type) ? "agent_assigned" : "notification";
                emitter.send(SseEmitter.event().name(eventName).data(json));
            } catch (IOException e) {
                emitters.remove(recipientEmail);
            }
        }
    }

    // --- FIX IS HERE: SPECIAL OTP METHOD ---
    public void sendVerificationCodeToCitizen(Complaint complaint) {
        if (complaint.getCitizen() == null) return;

        String email = complaint.getCitizen().getEmail();
        String code = complaint.getVerificationCode();
        String ticketId = complaint.getTicketId();

        // A. DB mein save karo (History ke liye)
        String message = "Service Complete! Your OTP is: " + code;
        createAndSendNotification(complaint.getCitizen().getId(), email, message, "OTP");

        // B. Frontend Popup ke liye SPECIAL Event bhejo ("verification_code")
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                Map<String, String> otpData = new HashMap<>();
                otpData.put("ticketId", ticketId);
                otpData.put("verificationCode", code);
                
                String json = objectMapper.writeValueAsString(otpData);

                // YAHAN HAI MAGIC: Event ka naam "verification_code" hona chahiye
                emitter.send(SseEmitter.event().name("verification_code").data(json));
                
                System.out.println("OTP Sent to: " + email); 
            } catch (IOException e) {
                emitters.remove(email);
            }
        }
    }

    // ... baaki methods (sendAgentAssignmentNotification, fetch logic) same rahenge ...
    // Agar chahiye to wo code bhi pura de sakta hu, par logic yahi change hua hai.
    
    public void sendAgentAssignmentNotification(Complaint complaint) {
        if (complaint.getAgent() != null) {
            createAndSendNotification(
                complaint.getAgent().getId(), 
                complaint.getAgent().getEmail(), 
                "New Complaint Assigned! Ticket: " + complaint.getTicketId(), 
                "ASSIGNMENT"
            );
        }
    }

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