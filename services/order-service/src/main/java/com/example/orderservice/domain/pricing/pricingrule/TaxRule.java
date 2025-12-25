package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;

import java.math.BigDecimal;

public class TaxRule implements PricingRule{

    @Override
    public void apply(OrderEntity order) {
        order.setTaxAmount(BigDecimal.ZERO);
    }

}
