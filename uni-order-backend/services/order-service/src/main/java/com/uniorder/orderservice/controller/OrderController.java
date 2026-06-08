package com.uniorder.orderservice.controller;

import com.uniorder.orderservice.dto.request.CreateOrderRequest;
import com.uniorder.orderservice.dto.response.OrderResponse;
import com.uniorder.orderservice.service.OrderService;
import com.uniorder.orderservice.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private OrderService orderService;

    private AuthUtil authUtil;

    public OrderController(OrderService orderService, AuthUtil authUtil) {
        this.orderService = orderService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestHeader("Authorization") String token
    ) {
        Long userId = authUtil.getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status, userId));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam String reason,
            @RequestHeader("Authorization") String token
    ) {
        Long userId = authUtil.getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.cancelOrder(orderId, reason, userId));
    }
}
