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
        System.out.println("🚀 DATA INITIALIZER: Checking Admin Status...");
        
        String adminEmail = "admin@smarteseva.com";
        
        try {
            Optional<User> existingUser = userRepository.findByEmail(adminEmail);
            
            if (existingUser.isPresent()) {
                System.out.println("⚠️ Admin User Found. Updating Status to 'Active'...");
                User admin = existingUser.get();
                
                // YAHAN CHANGE KIYA HAI: Status ko "Active" set kar rahe hain
                admin.setStatus("Active"); 
                
                // Agar koi boolean field bhi hai to use bhi true kar do (Safe side)
                // admin.setEnabled(true); 

                userRepository.save(admin);
                System.out.println("✅ UPDATE: Admin user status set to 'Active'.");
                
            } else {
                System.out.println("🛠️ Creating New Admin User...");
                
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_SUPER_ADMIN");
                admin.setName("Super Admin");
                
                // Naya user banate waqt hi Active set karo
                admin.setStatus("Active");
                
                userRepository.save(admin);
                
                System.out.println("✅ SUCCESS: Created NEW Admin with status 'Active'.");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("---------------------------------------------");
    }
}