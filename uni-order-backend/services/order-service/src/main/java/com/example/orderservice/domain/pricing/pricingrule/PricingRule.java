package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;

public interface PricingRule {
    void apply(OrderEntity order);
}
