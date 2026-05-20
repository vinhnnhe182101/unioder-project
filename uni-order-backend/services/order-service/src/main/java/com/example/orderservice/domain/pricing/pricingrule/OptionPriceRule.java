package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.entity.OrderEntity;
import com.example.orderservice.entity.OrderItemEntity;
import com.example.orderservice.entity.OrderItemOptionEntity;

import java.math.BigDecimal;

public class OptionPriceRule implements PricingRule {

    @Override
    public void apply(OrderEntity order) {

        for (OrderItemEntity item : order.getItems()) {

            BigDecimal optionTotal = item.getOptions().stream()
                    .map(OrderItemOptionEntity::getExtraPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal finalTotal =
                    item.getTotalPrice().add(
                            optionTotal.multiply(
                                    BigDecimal.valueOf(item.getQuantity())
                            )
                    );

            item.setTotalPrice(finalTotal);
        }
    }

}
