package com.wearify.model;

public class OrderItem {

    private String productId;
    private String productTitle;
    private int quantity;

    private OrderType orderType;
    private int rentalDays;

    private double price;
    private double deposit;

    public OrderItem() {
    }

    public OrderItem(String productId, String productTitle, int quantity,
                     OrderType orderType, int rentalDays, double price, double deposit) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.quantity = quantity;
        this.orderType = orderType;
        this.rentalDays = rentalDays;
        this.price = price;
        this.deposit = deposit;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public OrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(OrderType orderType) {
        this.orderType = orderType;
    }

    public int getRentalDays() {
        return rentalDays;
    }

    public void setRentalDays(int rentalDays) {
        this.rentalDays = rentalDays;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }
}