package com.uniorder.orderservice.service;

import com.uniorder.orderservice.dto.request.CreateOrderRequest;
import com.uniorder.orderservice.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    List<OrderResponse> getMyOrders();

    OrderResponse updateOrderStatus(Long orderId, String newStatusStr, Long userId);

    OrderResponse cancelOrder(Long orderId, String reason, Long userId);
}
