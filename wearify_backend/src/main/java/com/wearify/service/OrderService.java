package com.wearify.service;

import com.wearify.dto.CheckoutRequest;
import com.wearify.model.*;
import com.wearify.repository.CartRepository;
import com.wearify.repository.OrderRepository;
import com.wearify.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    // Checkout method
    public Order checkout(CheckoutRequest request) {

        // User ka cart nikalo
        List<Cart> cartItems = cartRepository.findByUserId(request.getUserId());

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();

        double totalAmount = 0.0;
        double totalDeposit = 0.0;
        double deliveryFee = 50.0; // abhi fixed delivery fee rakh rahe hain

        String shopId = null;

        for (Cart cart : cartItems) {

            Product product = productRepository.findById(cart.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cart.getProductId()));

            // Simple version:
            // ek order me same shop ke products hone chahiye
            if (shopId == null) {
                shopId = product.getShopId();
            } else if (!shopId.equals(product.getShopId())) {
                throw new RuntimeException("Currently, one order can contain products from only one shop");
            }

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductTitle(product.getTitle());
            item.setQuantity(cart.getQuantity());

            if (cart.isRent()) {
                // RENT logic
                item.setOrderType(OrderType.RENT);
                item.setRentalDays(cart.getRentDuration());

                double itemRentPrice = product.getRentPrice() * cart.getRentDuration() * cart.getQuantity();
                double itemDeposit = product.getDeposit() * cart.getQuantity();

                item.setPrice(itemRentPrice);
                item.setDeposit(itemDeposit);

                totalAmount += itemRentPrice;
                totalDeposit += itemDeposit;

            } else {
                // BUY logic
                item.setOrderType(OrderType.BUY);
                item.setRentalDays(0);

                double itemBuyPrice = product.getBuyPrice() * cart.getQuantity();

                item.setPrice(itemBuyPrice);
                item.setDeposit(0.0);

                totalAmount += itemBuyPrice;
            }

            orderItems.add(item);
        }

        // Final payable amount = product total + deposit + delivery fee
        double finalAmount = totalAmount + totalDeposit + deliveryFee;

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setShopId(shopId);
        order.setItems(orderItems);

        order.setTotalAmount(finalAmount);
        order.setDepositAmount(totalDeposit);
        order.setDeliveryFee(deliveryFee);

        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderStatus(OrderStatus.PLACED);

        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());

        order.setCreatedAt(LocalDateTime.now());

        // Approx expected delivery time 2 hours later
        order.setExpectedDeliveryTime(LocalDateTime.now().plusHours(2));

        // Agar rent item hai to max return date calculate kar sakte hain
        LocalDateTime returnDate = null;
        for (OrderItem item : orderItems) {
            if (item.getOrderType() == OrderType.RENT) {
                int days = item.getRentalDays();
                LocalDateTime possibleReturn = LocalDateTime.now().plusDays(days);

                if (returnDate == null || possibleReturn.isAfter(returnDate)) {
                    returnDate = possibleReturn;
                }
            }
        }
        order.setReturnDate(returnDate);

        // Order save karo
        Order savedOrder = orderRepository.save(order);

        // Checkout ke baad cart clear karo
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    // User ke orders dekhne ke liye
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Shop owner ke orders dekhne ke liye
    public List<Order> getOrdersByShopId(String shopId) {
        return orderRepository.findByShopId(shopId);
    }

    // Order status update
    public Order updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
    return orderRepository.findAll();
   }
}