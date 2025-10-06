package com.smarteseva.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // <-- Naya import
import org.springframework.security.core.userdetails.UserDetails; // <-- Naya import
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.smarteseva.backend.model.User;
import com.smarteseva.backend.repository.UserRepository; // <-- Naya import

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // --- THIS IS THE FIX ---
        // Create a list of authorities (roles) from the user's role string
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));

        // Return Spring Security's User object with the correct authorities
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }
}