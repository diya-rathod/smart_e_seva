package com.smarteseva.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.smarteseva.backend.entity.Notification;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository; // Repository import zaroori hai
import com.smarteseva.backend.service.JwtService;
import com.smarteseva.backend.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "*") 
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository; // User ID dhundne ke liye

    // --- 1. Real-time Connection (SSE) ---
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam String token) {
        String userEmail;
        try {
            userEmail = jwtService.extractUsername(token); 
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }
        
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        notificationService.addEmitter(userEmail, emitter);
        return emitter;
    }

    // --- 2. History API (Bell Icon List) ---
    @GetMapping("/my-notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(@RequestHeader("Authorization") String token) {
        try {
            // 1. Token se Email nikalo
            String email = jwtService.extractUsername(token.substring(7)); 
            
            // 2. DB se User dhundo (ID lene ke liye)
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // 3. ID use karke notifications lao
            return ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId()));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}