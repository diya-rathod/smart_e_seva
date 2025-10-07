package com.smarteseva.backend.controller;

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
    public SseEmitter subscribe() {
        // Create a new SseEmitter for this client, with a timeout
        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L); // 24 hours timeout

        // Add the emitter to our service
        notificationService.addEmitter(emitter);

        return emitter;
    }
}