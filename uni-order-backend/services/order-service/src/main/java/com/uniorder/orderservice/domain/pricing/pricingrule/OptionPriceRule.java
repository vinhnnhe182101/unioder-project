package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.entity.OrderItemEntity;
import com.uniorder.orderservice.entity.OrderItemOptionEntity;

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
