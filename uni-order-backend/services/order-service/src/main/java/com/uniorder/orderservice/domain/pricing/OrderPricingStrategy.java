package com.uniorder.orderservice.domain.pricing;

import com.uniorder.orderservice.entity.OrderEntity;

public interface OrderPricingStrategy {
    void price(OrderEntity order);
}
