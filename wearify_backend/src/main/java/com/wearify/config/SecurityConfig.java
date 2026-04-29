package com.wearify.config;

import com.wearify.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
             .cors(cors -> {})
            // API projects me CSRF disable
            .csrf(csrf -> csrf.disable())
            
            .formLogin(form -> form.disable())

            // JWT me session store nahi hota
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

        // Public APIs
        .requestMatchers("/auth/**").permitAll()

        // Products public ho sakte hai
        .requestMatchers("/products/**").permitAll()

        // Cart APIs (login user)
        .requestMatchers("/cart/**").permitAll()

        // Order APIs (login user)
        .requestMatchers("/orders/**").permitAll()

        // All secure
        .anyRequest().permitAll()
)

            // JWT filter run karega har request pe
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}