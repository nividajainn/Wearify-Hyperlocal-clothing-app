package com.wearify.repository;

import com.wearify.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// MongoRepository automatically CRUD operations provide karta hai
public interface CartRepository extends MongoRepository<Cart, String> {

    // Kisi user ke saare cart items nikalne ke liye
    List<Cart> findByUserId(String userId);

    // Same user + same product already cart me hai ya nahi
    Cart findByUserIdAndProductId(String userId, String productId);
}
