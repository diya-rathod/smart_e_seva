// package com.smarteseva.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.smarteseva.backend.dto.AuthResponseDTO;
// import com.smarteseva.backend.dto.LoginRequestDTO;
// import com.smarteseva.backend.model.User;
// import com.smarteseva.backend.repository.UserRepository;
// import com.smarteseva.backend.service.JwtService;

// @RestController
// @RequestMapping("/api/v1/auth")
// @CrossOrigin(origins = "http://localhost:3000")
// public class AuthController {

//     @Autowired
//     private UserRepository userRepository;
//     @Autowired
//     private PasswordEncoder passwordEncoder;
//     @Autowired
//     private JwtService jwtService;
//     @Autowired
//     private AuthenticationManager authenticationManager; // Inject AuthenticationManager

//     @PostMapping("/login")
//     public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
//         // Use AuthenticationManager to handle login
//         Authentication authentication = authenticationManager.authenticate(
//                 new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

//         if (authentication.isAuthenticated()) {
//             User user = userRepository.findByEmail(loginRequest.getEmail()).get();

//             // --- THIS LINE IS CHANGED ---
//             // Pass both email and role to generate the token
//             // --- YEH POORA BLOCK REPLACE KARNA HAI ---

//             // 1. User ka role aur details nikalo
//             String role = user.getRole();
//             boolean mustChangePassword;

//             // 2. Check karo: Agar SUPERADMIN hai, to feature ko hamesha 'false' rakho
//             if ("ROLE_SUPER_ADMIN".equals(role)) {
//                 mustChangePassword = false;
//             } else {
//                 // Baaki sab roles ke liye database se asli value uthao
//                 Boolean mustChange = user.getMustChangePassword();
//                 mustChangePassword = (mustChange == null) ? true : mustChange;
//             }

//             // 3. Nayi information (mustChangePassword) ko token mein daalo
//             String token = jwtService.generateToken(user.getEmail(), role, mustChangePassword);

//             // --- YAHAN TAK REPLACE KARNA HAI ---

//             AuthResponseDTO authResponse = new AuthResponseDTO(token, user.getRole());
//             return ResponseEntity.ok(authResponse);
//         } else {
//             throw new UsernameNotFoundException("Invalid user request!");
//         }
//     }
// }

package com.smarteseva.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    // @Autowired private PasswordEncoder passwordEncoder; // <-- Ise hata diya, iski zaroorat nahi
    @Autowired private JwtService jwtService;
    @Autowired private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // Step 1: Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // Step 2: Agar authentication successful hai, to aage badho
            if (authentication.isAuthenticated()) {
                // User ki details database se nikalo
                User user = userRepository.findByEmail(loginRequest.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found after authentication"));

                // Step 3: 'mustChangePassword' flag ko check karo
                String role = user.getRole();
                boolean mustChangePassword;

                if ("ROLE_SUPERADMIN".equals(role)) {
                    mustChangePassword = false; // SuperAdmin ke liye hamesha false
                } else {
                    Boolean mustChange = user.getMustChangePassword();
                    mustChangePassword = (mustChange == null) ? true : mustChange; // Puraane users ke liye default true
                }

                // Step 4: Token generate karo
                String token = jwtService.generateToken(user.getEmail(), role, mustChangePassword);
                
                // Step 5: Response bhejo
                AuthResponseDTO authResponse = new AuthResponseDTO(token, user.getRole());
                return ResponseEntity.ok(authResponse);
            } else {
                 // Yeh case aam taur par nahi aayega, kyunki authenticate() fail hone par exception dega
                return ResponseEntity.status(401).body("Authentication failed.");
            }
        } catch (Exception e) {
            // Step 6: Agar login fail hota hai, to saaf error bhejo
            System.err.println("!!! Authentication failed for: " + loginRequest.getEmail() + " - Exception: " + e.getMessage());
            return ResponseEntity.status(401).body("Login Failed: " + e.getMessage());
        }
    }
}