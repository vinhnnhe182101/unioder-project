package com.example.orderservice.mapper;

import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.entity.OrderEntity;
import com.example.orderservice.entity.OrderItemEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    public OrderResponse toResponse(OrderEntity entity) {
        if (entity == null) return null;

        List<OrderResponse.OrderItemResponse> itemResponses = entity.getItems() == null ?
                Collections.emptyList() :
                entity.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(entity.getOrderId())
                .orderNumber(entity.getOrderNumber())
                .status(entity.getStatus())
                .orderType(entity.getOrderType())
                .totalAmount(entity.getTotalAmount())
                .note(entity.getNote())
                .createdAt(entity.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderResponse.OrderItemResponse toItemResponse(OrderItemEntity entity) {
        return OrderResponse.OrderItemResponse.builder()
                .orderItemId(entity.getOrderItemId())
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .unitPrice(entity.getUnitPrice())
                .quantity(entity.getQuantity())
                .totalPrice(entity.getTotalPrice())
                .selectedOptions(entity.getSelectedOptionsJson())
                .note(entity.getNote())
                .build();
    }
}
