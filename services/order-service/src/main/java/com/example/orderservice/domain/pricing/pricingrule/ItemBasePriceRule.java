package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;
import com.example.orderservice.entity.OrderItemEntity;

import java.math.BigDecimal;

public class ItemBasePriceRule implements PricingRule {
    @Override
    public void apply(OrderEntity order) {
        for (OrderItemEntity item : order.getItems()) {
            BigDecimal base =
                    item.getUnitPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));

            item.setTotalPrice(base);
        }
    }
}
