package com.wearify.controller;

import com.wearify.dto.ShopRequest;
import com.wearify.model.Shop;
import com.wearify.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shops")
@CrossOrigin(origins = "*")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @PostMapping("/register")
    public Shop registerShop(@RequestBody ShopRequest request) {
        return shopService.registerShop(request);
    }

    @PutMapping("/approve/{shopId}")
    public Shop approveShop(@PathVariable String shopId) {
        return shopService.approveShop(shopId);
    }

    @GetMapping("/approved")
    public List<Shop> getApprovedShops() {
        return shopService.getAllApprovedShops();
    }

    @GetMapping("/nearby")
    public List<Shop> getNearbyShops(
            @RequestParam String city,
            @RequestParam Double lat,
            @RequestParam Double lng
    ) {
        return shopService.getNearbyShops(city, lat, lng);
    }
}