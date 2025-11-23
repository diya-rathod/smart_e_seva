package com.smarteseva.backend.component;

import java.util.Optional;

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
        System.out.println("---------------------------------------------");
        System.out.println("🚀 DATA INITIALIZER STARTED...");
        
        String adminEmail = "admin@smarteseva.com";
        
        try {
            // 1. Check karo user hai ya nahi
            Optional<User> existingUser = userRepository.findByEmail(adminEmail);
            
            if (existingUser.isPresent()) {
                System.out.println("⚠️ Admin User ALREADY EXISTS in Database!");
                System.out.println("📧 Email: " + existingUser.get().getEmail());
                System.out.println("🔑 Hashed Pass: " + existingUser.get().getPassword());
            } else {
                System.out.println("🛠️ Creating New Admin User...");
                
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_SUPER_ADMIN");
                admin.setName("Super Admin");
                // admin.setMobileNumber("9999999999"); // Agar required ho to uncomment karein
                
                userRepository.save(admin);
                
                System.out.println("✅ SUCCESS: Created ADMIN user.");
                System.out.println("📧 Login Email: " + adminEmail);
                System.out.println("🔑 Login Pass: admin123");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR in DataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("---------------------------------------------");
    }
}