package com.wearify.service;

import com.wearify.model.Cart;
import com.wearify.model.Product;
import com.wearify.repository.CartRepository;
import com.wearify.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    // Add item to cart
    public Cart addToCart(Cart cart) {

        // Product exists or not
        Product product = productRepository.findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Quantity valid honi chahiye
        if (cart.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // Rent selected hai to product rent ke liye available hona chahiye
        if (cart.isRent()) {
            if (!product.isAvailableForRent()) {
                throw new RuntimeException("This product is not available for rent");
            }

            if (cart.getRentDuration() <= 0) {
                throw new RuntimeException("Rent duration must be greater than 0");
            }
        } else {
            // Buy selected hai to product buy ke liye available hona chahiye
            if (!product.isAvailableForBuy()) {
                throw new RuntimeException("This product is not available for purchase");
            }
        }

        // Same user + same product already cart me hai kya
        Cart existingCart = cartRepository.findByUserIdAndProductId(
                cart.getUserId(),
                cart.getProductId()
        );

        if (existingCart != null) {
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
            existingCart.setRent(cart.isRent());
            existingCart.setRentDuration(cart.getRentDuration());

            return cartRepository.save(existingCart);
        }

        return cartRepository.save(cart);
    }

    // Get all cart items of a user
    public List<Cart> getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId);
    }

    // Remove one cart item
    public void removeCartItem(String cartId) {
        cartRepository.deleteById(cartId);
    }

    // Clear full cart
    public void clearCart(String userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(cartItems);
    }
}