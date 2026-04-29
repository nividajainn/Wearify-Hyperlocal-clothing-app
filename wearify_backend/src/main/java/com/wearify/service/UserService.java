package com.wearify.service;

import com.wearify.dto.RegisterRequest;
import com.wearify.model.Role;
import com.wearify.model.User;
import com.wearify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {

        // Check karo same email already exist to nahi
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // BCrypt password encoder use kar rahe hain
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPincode(request.getPincode());

        // Default role CUSTOMER rakh sakte hain
        // Agar request me role aaye to usko set karenge
        if (request.getRole() == null || request.getRole().isBlank()) {
            user.setRole(Role.CUSTOMER);
        } else {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        }

        return userRepository.save(user);
    }
    
    // Register new user
    public User register(User user) {

        // check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        // agar role null hai to default CUSTOMER rakh do
        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }

        // encode the password before saving
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    // Login method
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use password encoder to match password safely
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}