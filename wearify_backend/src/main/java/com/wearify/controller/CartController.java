package com.wearify.controller;

import com.wearify.model.Cart;
import com.wearify.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add item to cart
    @PostMapping("/add")
    public Cart addToCart(@RequestBody Cart cart) {
        return cartService.addToCart(cart);
    }

    // Get all cart items of one user
    @GetMapping("/user/{userId}")
    public List<Cart> getUserCart(@PathVariable String userId) {
        return cartService.getCartByUserId(userId);
    }

    // Delete one cart item
    @DeleteMapping("/{cartId}")
    public String removeCartItem(@PathVariable String cartId) {
        cartService.removeCartItem(cartId);
        return "Cart item removed successfully";
    }

    // Clear full cart
    @DeleteMapping("/clear/{userId}")
    public String clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return "Cart cleared successfully";
    }
}