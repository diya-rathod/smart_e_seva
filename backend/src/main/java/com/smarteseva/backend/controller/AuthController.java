package com.smarteseva.backend.controller;

import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.service.JwtService; // JwtService ko import karein
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService; // JwtService ko inject karein

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();

        if (passwordEncoder.matches(password, user.getPassword())) {
            // Password match hone par token generate karein
            String token = jwtService.generateToken(user.getEmail());

            // Token ko response mein bhejein
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}