package com.wearify.controller;

import com.wearify.dto.CheckoutRequest;
import com.wearify.model.Order;
import com.wearify.model.OrderStatus;
import com.wearify.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place order / checkout
    @PostMapping("/checkout")
    public Order checkout(@RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }

    // Update order status
    @PutMapping("/status/{orderId}")
    public Order updateStatus(@PathVariable String orderId,
                              @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    // Get all orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Get user orders
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // Get shop orders
    @GetMapping("/shop/{shopId}")
    public List<Order> getOrdersByShop(@PathVariable String shopId) {
        return orderService.getOrdersByShopId(shopId);
    }
}