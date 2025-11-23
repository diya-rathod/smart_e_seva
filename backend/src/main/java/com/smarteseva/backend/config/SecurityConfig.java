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
                .securityMatcher("/api/v1/**")

                // .authorizeHttpRequests(auth -> auth

                // // 1. OPTIONS requests ko hamesha allow karo (Pre-flight)
                // .requestMatchers(request ->
                // "OPTIONS".equals(request.getMethod())).permitAll()

                // // 2. Public endpoints (Auth aur SSE)
                // .requestMatchers("/api/v1/auth/**").permitAll()
                // .requestMatchers("/api/v1/notifications/**").permitAll()

                // .requestMatchers("/api/v1/admin/users/**").hasAnyAuthority("ROLE_ADMIN",
                // "ROLE_SUPER_ADMIN")

                // .requestMatchers("/api/v1/admin/register-admin").hasAuthority("ROLE_SUPER_ADMIN")
                // // 3. Baaki saare role-based rules
                // .requestMatchers("/api/v1/users/**").hasAnyAuthority("ROLE_CITIZEN",
                // "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_AGENT")
                // .requestMatchers("/api/v1/agent/**").hasAnyAuthority("ROLE_AGENT")

                // .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ROLE_ADMIN",
                // "ROLE_SUPER_ADMIN")

                // // 4. Complaint waale endpoints ab secure hain (Sirf logged-in user hi kar
                // // sakta
                // // hai)
                // .requestMatchers("/api/v1/complaints/**").authenticated()

                // // 5. Baaki bachi hui koi bhi request ho, uske liye login zaroori hai
                // .anyRequest().authenticated())
                .authorizeHttpRequests(auth -> auth

                        // 1. OPTIONS requests (hamesha sabse pehle)
                        // .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(request -> "OPTIONS".equals(request.getMethod())).permitAll()

                        // 2. Public endpoints (login, sse, etc.)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/notifications/**").permitAll()

                        // --- ADMIN RULES (Specific se General) ---
                        // 3. Sabse Specific Rule: Sirf SUPER_ADMIN ke liye

                        .requestMatchers("/api/v1/admin/register-admin").hasRole("SUPER_ADMIN")

                        .requestMatchers("/api/v1/admin/users/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        .requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // 4. Dusra Specific Rule: Admin aur SUPER_ADMIN ke liye

                        // 5. General Admin Rule: Baaki bache hue /admin/** routes ke liye

                        // --- BAAKI RULES ---
                        // 6. Agent ke liye rule
                        .requestMatchers("/api/v1/agent/**").hasRole("AGENT")

                        // 7. Baaki saare user endpoints ('/me', '/my-complaints', etc.)
                        .requestMatchers("/api/v1/users/**").authenticated()

                        // 8. Baaki bachi hui koi bhi request ho, uske liye login zaroori hai
                        .anyRequest().authenticated())

                // .authorizeSimpMessageMatchers(message -> { // STOMP messages ke liye rules
                //     message
                //             // CONNECT message ko allow karo bina authentication ke (testing ke liye)
                //             .simpTypeMatchers(SimpMessageType.CONNECT).permitAll()
                //             // Baaki sabhi messages ke liye authentication zaroori hai
                //             .anyMessage().authenticated();
                // })

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
        // configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://smart-e-seva.vercel.app"));
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}