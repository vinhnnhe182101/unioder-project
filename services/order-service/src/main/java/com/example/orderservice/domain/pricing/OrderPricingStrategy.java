package com.example.orderservice.domain.pricing;

import com.example.orderservice.entity.OrderEntity;
import org.springframework.stereotype.Component;

public interface OrderPricingStrategy {
    void price(OrderEntity order);
}
