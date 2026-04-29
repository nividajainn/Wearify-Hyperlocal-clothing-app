package com.wearify.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "users") // Ye MongoDB me "users" naam ka collection banayega
public class User {

    @Id // Ye primary key hai (MongoDB ka _id)
    private String id;

    private String name;      // User ka naam
    private String email;     // User ka email (login ke liye use hoga future me)
    
    @JsonIgnore
    private String password;  // Encrypted password store hoga
    
    private Role role;      // USER ya ADMIN role define karega
    private String phone;
    
     // Hyperlocal app ke liye basic address/location fields
    private String address;
    private String city;
    private String pincode;

    private Double latitude;
    private Double longitude;
    
   
    // Default constructor (Spring ko object banane ke liye zaruri hota hai)
    public User() {}

    // Getters & Setters (Data ko access karne ke liye)
    
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
     public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

}