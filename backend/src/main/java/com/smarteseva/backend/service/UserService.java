package com.smarteseva.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarteseva.backend.dto.ChangePasswordRequest;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Yeh SecurityConfig se aayega

    public void changePassword(String userEmail, ChangePasswordRequest request) {
        
        // 1. User ko database se dhoondho
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Purana password check karo
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            // Agar match nahi hua, to error do
            throw new RuntimeException("Incorrect current password");
        }

        // 3. Naya aur confirm password check karo
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // 4. Sab theek hai, to naya password encode karke save karo
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }
}