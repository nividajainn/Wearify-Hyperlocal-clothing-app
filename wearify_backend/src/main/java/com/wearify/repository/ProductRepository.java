package com.wearify.repository;

import com.wearify.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    // Kisi specific shop ke products nikalne ke liye
    List<Product> findByShopId(String shopId);
    List<Product> findByCategoryIgnoreCase(String category);
}