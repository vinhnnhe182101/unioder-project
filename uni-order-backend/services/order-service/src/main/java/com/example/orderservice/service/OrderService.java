package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.entity.OrderEntity;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    List<OrderResponse> getMyOrders();

    OrderResponse updateOrderStatus(Long orderId, String newStatusStr, Long userId);

    OrderResponse cancelOrder(Long orderId, String reason, Long userId);
}
