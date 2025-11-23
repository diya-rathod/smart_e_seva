// //controller/NotificationController.java

// package com.smarteseva.backend.controller;

// import java.security.Principal; // <--- Import Zaroori Hai

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.MediaType;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

// import com.smarteseva.backend.service.NotificationService; // <-- Import UserDetails

// @RestController
// @RequestMapping("/api/v1/notifications")
// @CrossOrigin(origins = "http://localhost:3000")
// public class NotificationController {

//     @Autowired
//     private NotificationService notificationService;

//     @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//     // 1. Principal argument add karein
//     public SseEmitter subscribe(Principal principal) { 
        
//         // Agar Principal null hai, toh handle karein (not logged in)
//         if (principal == null) {
//             // Ya toh Forbidden return karein, ya ek error emitter
//             return new SseEmitter(0L); 
//         }

//         // Logged-in user ka email nikalenge (Spring Security mein yehi username hota hai)
//         String userEmail = principal.getName(); 

//         // Create a new SseEmitter for this client
//         SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 24 hours timeout

//         // 2. Service call ko fix karein: variable types remove karein aur userIdentifier pass karein
//         notificationService.addEmitter(userEmail, emitter);

//         // 3. Return statement ko fix karein
//         return emitter;
//     }
// }




// NotificationController.java

package com.smarteseva.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // <-- Naya import
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException; // <-- Naya import
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.smarteseva.backend.service.JwtService;
import com.smarteseva.backend.service.NotificationService; // <-- APNI JWT UTILITY CLASS KO IMPORT KAREIN

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtService jwtService; // <-- APNI JWT UTILITY CLASS KO INJECT KAREIN

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    // FIX: Principal ki jagah token ko @RequestParam se lenge
    public SseEmitter subscribe(@RequestParam String token) {
        
        String userEmail;
        try {
            // FIX: Token se email extract karein
            userEmail = jwtService.extractUsername(token); 
        } catch (Exception e) {
            // Agar token invalid hai to connection reject kar dein
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        if (userEmail == null || userEmail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email could not be extracted from token");
        }

        // Ab humein user ka email mil gaya hai
        System.out.println("SSE connection request for user: " + userEmail);

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        // Service ko user ka email pass karein
        notificationService.addEmitter(userEmail, emitter);

        return emitter;
    }
}