package com.smarteseva.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarteseva.backend.dto.AuthResponseDTO;
import com.smarteseva.backend.dto.LoginRequestDTO;
import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository;
import com.smarteseva.backend.service.JwtService;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private AuthenticationManager authenticationManager; // Inject AuthenticationManager

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        newUser.setRole("ROLE_CITIZEN");
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
        // Use AuthenticationManager to handle login
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(loginRequest.getEmail()).get();
    
            // --- THIS LINE IS CHANGED ---
            // Pass both email and role to generate the token
            String token = jwtService.generateToken(user.getEmail(), user.getRole());
            
            AuthResponseDTO authResponse = new AuthResponseDTO(token, user.getRole());
            return ResponseEntity.ok(authResponse);
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}