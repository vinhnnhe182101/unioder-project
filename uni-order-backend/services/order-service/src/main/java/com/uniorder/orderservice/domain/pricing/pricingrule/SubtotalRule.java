package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.entity.OrderItemEntity;

import java.math.BigDecimal;

public class SubtotalRule implements PricingRule{

    @Override
    public void apply(OrderEntity order) {

        BigDecimal subtotal = order.getItems().stream()
                .map(OrderItemEntity::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setSubtotalAmount(subtotal);
    }

}
