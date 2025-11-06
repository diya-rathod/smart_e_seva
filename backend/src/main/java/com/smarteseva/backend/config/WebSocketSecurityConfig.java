package com.smarteseva.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            // CONNECT message ko allow karo bina authentication ke (testing ke liye)
            .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.SUBSCRIBE).permitAll()
            // Baaki sabhi messages ke liye authentication zaroori hai
            .anyMessage().authenticated();
    }

    // CSRF protection ko WebSocket ke liye disable karna zaroori hai
    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}