package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.entity.OrderEntity;

import java.math.BigDecimal;

public class TaxRule implements PricingRule{

    @Override
    public void apply(OrderEntity order) {
        order.setTaxAmount(BigDecimal.ZERO);
    }

}
