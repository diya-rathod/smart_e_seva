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
        // DEBUG LOG 1: Kaun Connect hua?
        System.out.println(">>> DEBUG: Adding User to Map: [" + userEmail + "]");
        
        emitters.put(userEmail, emitter);
        
        emitter.onCompletion(() -> {
            System.out.println(">>> DEBUG: Connection Closed for: " + userEmail);
            emitters.remove(userEmail);
        });
        emitter.onTimeout(() -> {
            System.out.println(">>> DEBUG: Connection Timeout for: " + userEmail);
            emitters.remove(userEmail);
        });
    }

    public void createAndSendNotification(Long recipientId, String recipientEmail, String message, String type) {
        Notification notif = new Notification();
        notif.setRecipientId(recipientId);
        notif.setMessage(message);
        notif.setType(type);
        notif.setTimestamp(LocalDateTime.now());
        notif.setRead(false);
        notificationRepository.save(notif);

        SseEmitter emitter = emitters.get(recipientEmail);
        if (emitter != null) {
            try {
                String json = objectMapper.writeValueAsString(notif);
                String eventName = "ASSIGNMENT".equals(type) ? "agent_assigned" : "notification";
                emitter.send(SseEmitter.event().name(eventName).data(json));
            } catch (IOException e) {
                emitters.remove(recipientEmail);
            }
        }
    }

    // --- OTP METHOD (WITH HEAVY DEBUGGING) ---
    public void sendVerificationCodeToCitizen(Complaint complaint) {
        if (complaint.getCitizen() == null) {
            System.out.println(">>> ERROR: Complaint has no Citizen attached!");
            return;
        }

        String email = complaint.getCitizen().getEmail();
        String code = complaint.getVerificationCode();
        String ticketId = complaint.getTicketId();

        // Log 2: Kisko bhejne ki koshish kar rahe hain?
        System.out.println(">>> DEBUG: Trying to send OTP to Email: [" + email + "]");
        
        // Log 3: Kya wo Map mein maujood hai?
        boolean isOnline = emitters.containsKey(email);
        System.out.println(">>> DEBUG: Is User Online in Map? " + isOnline);
        
        if(!isOnline) {
            System.out.println(">>> DEBUG: Available Users in Map are: " + emitters.keySet());
        }

        // DB Save
        String message = "Service Complete! OTP: " + code;
        createAndSendNotification(complaint.getCitizen().getId(), email, message, "OTP");

        // Live Send
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                Map<String, String> otpData = new HashMap<>();
                otpData.put("ticketId", ticketId);
                otpData.put("verificationCode", code);
                
                String json = objectMapper.writeValueAsString(otpData);

                // Yahan Event bhej rahe hain
                emitter.send(SseEmitter.event().name("verification_code").data(json));
                
                System.out.println(">>> SUCCESS: OTP Packet Sent to Frontend for " + email);
            } catch (IOException e) {
                System.out.println(">>> ERROR: Sending failed: " + e.getMessage());
                emitters.remove(email);
            }
        } else {
            System.out.println(">>> FAILURE: Emitter is NULL via get()");
        }
    }

    // ... baaki methods same ...
    public void sendAgentAssignmentNotification(Complaint complaint) {
        if(complaint.getAgent() != null) {
             createAndSendNotification(complaint.getAgent().getId(), complaint.getAgent().getEmail(), "Job Assigned", "ASSIGNMENT");
        }
    }
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByTimestampDesc(userId);
    }
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> { n.setRead(true); notificationRepository.save(n); });
    }
}