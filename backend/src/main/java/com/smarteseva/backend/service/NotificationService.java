package com.smarteseva.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
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
        
        try {
            emitter.send(SseEmitter.event().name("CONNECT").data("Connected to Notification Service"));
        } catch (IOException e) {
            emitters.remove(userEmail);
        }
    }

    // --- 2. MAIN LOGIC: Save to DB & Send to Frontend ---
    public void createAndSendNotification(Long recipientId, String recipientEmail, String message, String type) {
        
        // A. Save to Database (History ke liye)
        Notification notif = new Notification();
        notif.setRecipientId(recipientId);
        notif.setMessage(message);
        notif.setType(type);
        notif.setTimestamp(LocalDateTime.now());
        notif.setRead(false);
        notificationRepository.save(notif);

        // B. Send Real-time Alert (Toast ke liye) via SSE
        SseEmitter emitter = emitters.get(recipientEmail);
        if (emitter != null) {
            try {
                // Hum pura notification object bhej rahe hain taaki frontend par ID bhi mile
                String json = objectMapper.writeValueAsString(notif);
                // emitter.send(SseEmitter.event().name("notification").data(json));

                String eventName = "notification"; // Default
                if ("OTP".equals(type)) {
                    eventName = "verification_code"; // Purana frontend listener iska wait kar raha hai
                } else if ("ASSIGNMENT".equals(type)) {
                    eventName = "agent_assigned"; // Agent dashboard iska wait kar raha hai
                }
                emitter.send(SseEmitter.event().name(eventName).data(json));
            } catch (IOException e) {
                emitters.remove(recipientEmail);
            }
        }
    }

    // --- 3. Trigger Methods (Controllers yaha call karenge) ---

    // Jab Admin Agent ko assign kare
    public void sendAgentAssignmentNotification(Complaint complaint) {
        if (complaint.getAgent() != null) {
            String message = "New Complaint Assigned! Ticket: " + complaint.getTicketId();
            // DB Save + SSE
            createAndSendNotification(
                complaint.getAgent().getId(), 
                complaint.getAgent().getEmail(), 
                message, 
                "ASSIGNMENT"
            );
        }
    }

    // Jab Verification Code generate ho (User ke liye)
    public void sendVerificationCodeToCitizen(Complaint complaint) {
        if (complaint.getCitizen() != null) {
            String message = "Your OTP for Ticket " + complaint.getTicketId() + " is: " + complaint.getVerificationCode();
            createAndSendNotification(
                complaint.getCitizen().getId(), 
                complaint.getCitizen().getEmail(), 
                message, 
                "OTP"
            );
        }
    }

    // --- 4. Fetch History Methods ---
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