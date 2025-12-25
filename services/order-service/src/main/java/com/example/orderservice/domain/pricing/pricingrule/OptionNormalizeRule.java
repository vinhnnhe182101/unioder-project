package com.example.orderservice.domain.pricing.pricingrule;

import com.example.orderservice.domain.option.OptionNormalizer;
import com.example.orderservice.entity.OrderEntity;
import com.example.orderservice.entity.OrderItemEntity;
import com.example.orderservice.entity.OrderItemOptionEntity;

import java.util.List;

public class OptionNormalizeRule implements PricingRule{

    @Override
    public void apply(OrderEntity order) {

        for (OrderItemEntity item : order.getItems()) {

            if (item.getSelectedOptionsJson() == null) continue;

            List<OrderItemOptionEntity> options =
                    OptionNormalizer.normalize(
                            item.getSelectedOptionsJson(),
                            item
                    );

            item.getOptions().clear();
            item.getOptions().addAll(options);
        }
    }
}
