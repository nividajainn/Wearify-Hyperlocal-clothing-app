package com.wearify.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
// MongoDB me "products" collection banega
public class Product {

    @Id
    private String id;

    private String name;
    private String category;
    private double price;      // Ye batata hai product kis shop ka hai
    private String shopId;
    private String description;
    // true means this product can also be rented
    private boolean availableForRent;
    private String title;
    
    // Rent charge per day
    private double rentPricePerDay;

    // Security deposit taken during rent
    private double deposit;

    private String brand;
    private String size;
    private String color;
    private String gender;
    private String occasion;

    private Double buyPrice;
    private Double rentPrice;
    
    private boolean availableForBuy;
    
    private boolean available;
    private String imageUrl;

    public Product(String id, String shopId, String title, String description, String category, String brand,
                   String size, String color, String gender, String occasion, Double buyPrice, Double rentPrice,
                   Double deposit, boolean availableForBuy, boolean availableForRent, boolean available,
                   Integer stock, String imageUrl) {
        this.id = id;
        this.shopId = shopId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.brand = brand;
        this.size = size;
        this.color = color;
        this.gender = gender;
        this.occasion = occasion;
        this.buyPrice = buyPrice;
        this.rentPrice = rentPrice;
        this.deposit = deposit;
        this.availableForBuy = availableForBuy;
        this.availableForRent = availableForRent;
        this.available = available;
        this.stock = stock;
        this.imageUrl = imageUrl;
    }
     
    // getters setters
    public boolean isAvailableForRent() {
        return availableForRent;
    }

    public void setAvailableForRent(boolean availableForRent) {
        this.availableForRent = availableForRent;
    }

    public double getRentPricePerDay() {
        return rentPricePerDay;
    }

    public void setRentPricePerDay(double rentPricePerDay) {
        this.rentPricePerDay = rentPricePerDay;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    private int stock; 

    public Product() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

     public String getShopId() {
        return shopId;
    }

    public void setShopId(String shopId) {
        this.shopId = shopId;
    }
    
    public int getStock() {
    return stock;
    }

    public void setStock(int stock) {
    this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

     public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public Double getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(Double buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Double getRentPrice() {
        return rentPrice;
    }

    public void setRentPrice(Double rentPrice) {
        this.rentPrice = rentPrice;
    }

    public boolean isAvailableForBuy() {
        return availableForBuy;
    }

    public void setAvailableForBuy(boolean availableForBuy) {
        this.availableForBuy = availableForBuy;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}