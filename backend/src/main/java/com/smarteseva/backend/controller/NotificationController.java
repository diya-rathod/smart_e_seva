//controller/NotificationController.java

package com.smarteseva.backend.controller;

import java.security.Principal; // <--- Import Zaroori Hai

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.smarteseva.backend.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/subscribe")
    // 1. Principal argument add karein
    public SseEmitter subscribe(Principal principal) { 
        
        // Agar Principal null hai, toh handle karein (not logged in)
        if (principal == null) {
            // Ya toh Forbidden return karein, ya ek error emitter
            return new SseEmitter(0L); 
        }

        // Logged-in user ka email nikalenge (Spring Security mein yehi username hota hai)
        String userIdentifier = principal.getName(); 

        // Create a new SseEmitter for this client
        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L); // 24 hours timeout

        // 2. Service call ko fix karein: variable types remove karein aur userIdentifier pass karein
        notificationService.addEmitter(userIdentifier, emitter);

        // 3. Return statement ko fix karein
        return emitter;
    }
}