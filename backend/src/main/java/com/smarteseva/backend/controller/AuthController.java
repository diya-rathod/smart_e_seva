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
            // --- YEH POORA BLOCK REPLACE KARNA HAI ---

      // 1. User ka role aur details nikalo
      String role = user.getRole();
      boolean mustChangePassword;

      // 2. Check karo: Agar SUPERADMIN hai, to feature ko hamesha 'false' rakho
      if ("ROLE_SUPER_ADMIN".equals(role)) {
        mustChangePassword = false;
      } else {
        // Baaki sab roles ke liye database se asli value uthao
        Boolean mustChange = user.getMustChangePassword();
        mustChangePassword = (mustChange == null) ? true : mustChange;
      }

      // 3. Nayi information (mustChangePassword) ko token mein daalo
      String token = jwtService.generateToken(user.getEmail(), role, mustChangePassword);
      
      // --- YAHAN TAK REPLACE KARNA HAI ---
            
            AuthResponseDTO authResponse = new AuthResponseDTO(token, user.getRole());
            return ResponseEntity.ok(authResponse);
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}