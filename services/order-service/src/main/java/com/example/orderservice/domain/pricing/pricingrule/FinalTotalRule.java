package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;

public class FinalTotalRule implements PricingRule {

    @Override
    public void apply(OrderEntity order) {
        order.setTotalAmount(
                order.getSubtotalAmount()
                        .add(order.getTaxAmount())
                        .subtract(order.getDiscountAmount())
                        .add(order.getShippingFee())
        );
    }
}
