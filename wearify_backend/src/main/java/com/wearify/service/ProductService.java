package com.wearify.service;

import com.wearify.dto.ProductRequest;
import com.wearify.model.Product;
import com.wearify.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        Product product = new Product();

        product.setShopId(request.getShopId());
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setSize(request.getSize());
        product.setColor(request.getColor());
        product.setGender(request.getGender());
        product.setOccasion(request.getOccasion());

        product.setBuyPrice(request.getBuyPrice());
        product.setRentPrice(request.getRentPrice());
        product.setDeposit(request.getDeposit());

        product.setAvailableForBuy(request.isAvailableForBuy());
        product.setAvailableForRent(request.isAvailableForRent());
        product.setAvailable(request.isAvailable());

        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());

        return productRepository.save(product);
    }

    public List<Product> getByShopId(String shopId) {
        return productRepository.findByShopId(shopId);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}