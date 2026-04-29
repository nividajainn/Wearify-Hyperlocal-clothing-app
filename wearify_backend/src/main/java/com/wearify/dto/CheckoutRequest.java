package com.wearify.dto;

public class CheckoutRequest {

    // Kis user ka cart checkout karna hai
    private String userId;

    // Delivery address
    private String deliveryAddress;
    private String city;
    private String pincode;

    public CheckoutRequest() {
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
