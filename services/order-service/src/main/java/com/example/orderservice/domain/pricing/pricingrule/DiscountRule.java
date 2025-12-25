package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;

import java.math.BigDecimal;

public class DiscountRule implements PricingRule{

    @Override
    public void apply(OrderEntity order) {
        order.setDiscountAmount(BigDecimal.ZERO);
    }
}
