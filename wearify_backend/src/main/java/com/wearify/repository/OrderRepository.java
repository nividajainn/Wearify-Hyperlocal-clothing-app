package com.wearify.repository;

import com.wearify.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    // Custom query to find orders by user
    List<Order> findByUserId(String userId);
    // Shop ke orders
    List<Order> findByShopId(String shopId);
}