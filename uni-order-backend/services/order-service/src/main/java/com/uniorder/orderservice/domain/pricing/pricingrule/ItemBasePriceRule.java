package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.entity.OrderItemEntity;

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
