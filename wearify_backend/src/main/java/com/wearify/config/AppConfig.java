package com.wearify.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Ye configuration class hai
public class AppConfig {

    // Ye bean Spring container me register hoga
    @Bean
    public PasswordEncoder passwordEncoder() {

        // BCrypt industry standard encryption hai
        return new BCryptPasswordEncoder();
    }
}
