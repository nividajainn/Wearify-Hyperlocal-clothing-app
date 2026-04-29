package com.wearify.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.wearify.model.User;

import java.util.Optional;


// Ye interface MongoRepository ko extend karta hai
// Spring automatically CRUD methods de deta hai
public interface UserRepository extends MongoRepository<User, String> {

    // Future me login ke liye email se user find karna padega
    Optional<User> findByEmail(String email);
}