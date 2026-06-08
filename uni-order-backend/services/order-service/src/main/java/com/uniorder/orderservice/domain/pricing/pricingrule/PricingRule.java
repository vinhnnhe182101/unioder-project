package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.entity.OrderEntity;

public interface PricingRule {
    void apply(OrderEntity order);
}
