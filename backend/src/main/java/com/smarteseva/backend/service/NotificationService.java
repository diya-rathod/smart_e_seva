package com.smarteseva.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.smarteseva.backend.entity.Complaint;

@Service
public class NotificationService {

    // A thread-safe list to store all active connections
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }

    public void sendNewComplaintNotification(Complaint complaint) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("new_complaint")  //Event name for the frontend to listen to
                        .data(complaint)); // Send the new complaint data as JSON
            } catch (IOException e) {
                //  This emitter is broken, remove it
                emitters.remove(emitter);
            }
        }
    }
}