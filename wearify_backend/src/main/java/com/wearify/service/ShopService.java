package com.wearify.service;

import com.wearify.dto.ShopRequest;
import com.wearify.model.Shop;
import com.wearify.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    public Shop registerShop(ShopRequest request) {
        Shop shop = new Shop();

        shop.setOwnerId(request.getOwnerId());
        shop.setShopName(request.getShopName());
        shop.setOwnerName(request.getOwnerName());
        shop.setEmail(request.getEmail());
        shop.setPhone(request.getPhone());

        shop.setAddress(request.getAddress());
        shop.setCity(request.getCity());
        shop.setPincode(request.getPincode());

        shop.setLatitude(request.getLatitude());
        shop.setLongitude(request.getLongitude());
        shop.setDeliveryRadius(request.getDeliveryRadius());

        shop.setImageUrl(request.getImageUrl());
        shop.setCategory(request.getCategory());

        // Nayi shop ko admin approve karega
        shop.setApproved(false);

        // Shop by default open rakh sakte ho
        shop.setOpen(true);

        return shopRepository.save(shop);
    }

    public List<Shop> getAllApprovedShops() {
        return shopRepository.findByApprovedTrue();
    }

    public Shop approveShop(String shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        shop.setApproved(true);
        return shopRepository.save(shop);
    }

    public List<Shop> getNearbyShops(String city, Double userLat, Double userLng) {
        List<Shop> shops = shopRepository.findByCityIgnoreCaseAndApprovedTrue(city);
        List<Shop> nearby = new ArrayList<>();

        for (Shop shop : shops) {

            // Agar shop ke lat/lng missing hain to skip karo
            if (shop.getLatitude() == null || shop.getLongitude() == null || shop.getDeliveryRadius() == null) {
                continue;
            }

            double distance = calculateDistanceKm(userLat, userLng, shop.getLatitude(), shop.getLongitude());

            // Agar user shop ke delivery radius ke andar hai to nearby list me add karo
            if (distance <= shop.getDeliveryRadius()) {
                nearby.add(shop);
            }
        }

        return nearby;
    }

    // Haversine formula se earth par 2 points ke beech distance nikalte hain
    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}