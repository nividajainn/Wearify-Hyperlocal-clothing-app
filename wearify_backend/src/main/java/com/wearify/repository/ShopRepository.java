package com.wearify.repository;

import com.wearify.model.Shop;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ShopRepository extends MongoRepository<Shop, String> {

    // City ke basis par shops find karne ke liye
   List<Shop> findByApprovedTrue();

    List<Shop> findByOwnerId(String ownerId);

    List<Shop> findByCityIgnoreCaseAndApprovedTrue(String city);
}