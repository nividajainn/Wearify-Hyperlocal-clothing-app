package com.wearify.controller;

import com.wearify.dto.AuthResponse;
import com.wearify.dto.LoginRequest;
import com.wearify.dto.RegisterRequest;
import com.wearify.model.User;
import com.wearify.service.UserService;
import com.wearify.security.JwtUtil;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth") // base URL for authentication APIs
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    // constructor injection
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // REGISTER API
   
    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request) {

        // user ko database me save karega using DTO
        return userService.register(request);
    }

// Login API
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User loggedUser = userService.login(request.getEmail(), request.getPassword());

        String token = jwtUtil.generateToken(loggedUser.getEmail());
        return new AuthResponse(token, loggedUser);
    }
    
    @PostMapping("/test")
     public String test(@RequestBody User user){
    return user.getEmail();
    }
}