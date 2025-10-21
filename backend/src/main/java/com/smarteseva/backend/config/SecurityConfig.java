package com.smarteseva.backend.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.smarteseva.backend.filter.JwtAuthFilter;
import com.smarteseva.backend.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter authFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsServiceImpl();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults()) // Apply CORS configuration from the bean
                .csrf(csrf -> csrf.disable())
                // Inside the securityFilterChain method...
                
                // .authorizeHttpRequests(auth -> auth

                // .requestMatchers(request -> "OPTIONS".equals(request.getMethod())).permitAll()
 
                // // FIX 1: CITIZEN/USERS RULE ko sabse upar rakhte hain (Priority #1)
                //     .requestMatchers("/api/v1/users/**").hasAnyAuthority("ROLE_CITIZEN", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_AGENT") 
 
                // // FIX 2: AGENT RULE (Priority #2)
                //     .requestMatchers("/api/v1/agent/**").hasAnyAuthority("ROLE_AGENT") 
                
                // // FIX 3: ADMIN RULE (Priority #3)
                //     .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
                //     .requestMatchers("/api/v1/admin/register-admin").hasAuthority("ROLE_SUPER_ADMIN")
                //     .requestMatchers("/api/v1/complaints/**").authenticated()
                
                // // Public/Notifications (Priority #4)
                //     .requestMatchers("/api/v1/auth/**").permitAll()
                //     .requestMatchers("/api/v1/notifications/**").permitAll()
 
                // // All other requests need to be authenticated
                //     .anyRequest().authenticated()
                // )

                .authorizeHttpRequests(auth -> auth

    	// 1. OPTIONS requests ko hamesha allow karo (Pre-flight)
    	.requestMatchers(request -> "OPTIONS".equals(request.getMethod())).permitAll()

 					// 2. Public endpoints (Auth aur SSE)
 					.requestMatchers("/api/v1/auth/**").permitAll() 
 					.requestMatchers("/api/v1/notifications/**").permitAll()

    	// 3. Baaki saare role-based rules
     .requestMatchers("/api/v1/users/**").hasAnyAuthority("ROLE_CITIZEN", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_AGENT") 
     .requestMatchers("/api/v1/agent/**").hasAnyAuthority("ROLE_AGENT") 
     .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
     .requestMatchers("/api/v1/admin/register-admin").hasAuthority("ROLE_SUPER_ADMIN")
    
    	// 4. Complaint waale endpoints ab secure hain (Sirf logged-in user hi kar sakta hai)
 					.requestMatchers("/api/v1/complaints/**").authenticated() 

    	// 5. Baaki bachi hui koi bhi request ho, uske liye login zaroori hai
     .anyRequest().authenticated()
    )
                
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}