package com.wearify.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// MongoDB collection ka naam "cart" hoga
@Document(collection = "cart")
public class Cart {

    // Unique ID for cart item
    @Id
    private String id;

    // Kis user ka cart hai
    private String userId;

    // Kaunsa product cart me add hua hai
    private String productId;

    // Kitni quantity add hui hai
    private int quantity;
    
     // true = user wants to rent instead of buy
    private boolean rent;

    // How many days user wants to rent
    private int rentDuration;

    // Default constructor (Spring ko object create karne ke liye chahiye)
    public Cart() {}

    // Parameterized constructor (object create karne ke liye)
    public Cart(String userId, String productId, int quantity, boolean rent, int rentDuration) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.rent = rent;
        this.rentDuration = rentDuration;
    }

    // Getter methods → data read karne ke liye

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }

    // Setter methods → data update karne ke liye

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // true means this cart item is for rent
    public boolean isRent() {
        return rent;
    }

    public void setRent(boolean rent) {
        this.rent = rent;
    }

    // Rent duration in days
    public int getRentDuration() {
        return rentDuration;
    }

    public void setRentDuration(int rentDuration) {
        this.rentDuration = rentDuration;
    }
}
