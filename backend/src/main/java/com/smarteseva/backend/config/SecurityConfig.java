package com.smarteseva.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain; // Ise import karein

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection for stateless REST APIs
            .csrf(csrf -> csrf.disable())
            
            // Define authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow public access to all endpoints under /api/auth/
                .requestMatchers("/api/auth/**").permitAll()
                
                // All other requests must be authenticated
                .anyRequest().authenticated()
            );

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

