package com.smarteseva.backend.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if the admin user already exists
        if (!userRepository.findByEmail("admin@smarteseva.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@smarteseva.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Encode the password
            admin.setRole("ROLE_ADMIN");
            // Set other necessary fields if any, e.g., name
            admin.setName("Admin User");
            
            userRepository.save(admin);
            System.out.println("Created ADMIN user with email: admin@smarteseva.com");
        }
    }
}