//service/NotificationService.java

package com.smarteseva.backend.service;

import java.io.IOException;
import java.util.Map; // Iski zaroorat nahi
import java.util.concurrent.ConcurrentHashMap; // Iski zaroorat nahi

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarteseva.backend.entity.Complaint;

@Service
public class NotificationService {

    // FIX 1 & 2: emitters ko String key (userEmail) ke liye Map se replace karein
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>(); 
    
    // FIX 3: ObjectMapper ko initialize karein
    private final ObjectMapper objectMapper = new ObjectMapper(); 


    // --- Existing addEmitter ko update karein takki woh ID use karein ---
    // (Aapko Controller mein isko call karte waqt user ka email ya ID bhejna hoga)
    public void addEmitter(String userIdentifier, SseEmitter emitter) { 
        emitters.put(userIdentifier, emitter);

        emitter.onCompletion(() -> emitters.remove(userIdentifier));
        emitter.onTimeout(() -> emitters.remove(userIdentifier));

        // Initial dummy event bhejte hain
        try {
            emitter.send(SseEmitter.event().name("CONNECT").data("Connection Established"));
        } catch (IOException e) {
            emitters.remove(userIdentifier);
        }
    }

    // --- sendNewComplaintNotification ko update karein (Broadcast logic agar zaroori hai) ---
    public void sendNewComplaintNotification(Complaint complaint) {
        // Ab hum Map ki values par iterate karenge
        for (Map.Entry<String, SseEmitter> entry : emitters.entrySet()) {
            // NOTE: Yahan aapko filter karna padega ki kaun Admin hai.
            // Hum assume karte hain ki Admin ki ID mein "admin" word hai, ya aap use database se check kar sakte hain.
            // For now, yeh sabhi connected users ko bhejega, jo theek nahi hai.
            // For Admin broadcast, aapko ek alag 'adminEmitters' map use karna chahiye ya yahan filtering karni chahiye.

            SseEmitter emitter = entry.getValue();

            try {
                 // Complaint object ko Stringify karein
                String eventData = objectMapper.writeValueAsString(complaint);
                
                emitter.send(SseEmitter.event()
                        .name("new_complaint")  //Event name for the frontend to listen to
                        .data(eventData)); // Send the new complaint data as JSON
            } catch (IOException e) {
                 emitter.completeWithError(e); 
                 emitters.remove(entry.getKey());
            }
        }
    }


    // --- Agent Assignment Notification (FIXED) ---
    public void sendAgentAssignmentNotification(Complaint complaint) {
        if (complaint.getAgent() == null) {
            return;
        }

        String agentIdentifier = complaint.getAgent().getEmail(); 
        
        // FIX 1 & 2: emitters.get(agentIdentifier) ab Map se kaam karega
        SseEmitter emitter = emitters.get(agentIdentifier); 

        if (emitter != null) {
            try {
                // FIX 3: objectMapper ab available hai
                String eventData = objectMapper.writeValueAsString(complaint);
                
                emitter.send(SseEmitter.event()
                        .name("agent_assigned") 
                        .data(eventData)
                        .id(String.valueOf(complaint.getId())));

            } catch (IOException e) {
                emitter.completeWithError(e); 
                emitters.remove(agentIdentifier);
            }
        }
    }
}