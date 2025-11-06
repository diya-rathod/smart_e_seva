package com.smarteseva.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket ko "On" karta hai
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Yeh woh "gate" hai jahan frontend connect karega
        // Example URL: http://localhost:8080/ws
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Yeh "channels" ya "topics" banata hai jahan messages broadcast honge
        // Frontend /topic/complaint/{id}/location jaise channels ko sunega
        registry.enableSimpleBroker("/topic");
        
        // Yeh prefix hai jab frontend backend ko message bhejta hai (abhi zaroorat nahi)
        registry.setApplicationDestinationPrefixes("/app");
    }
}