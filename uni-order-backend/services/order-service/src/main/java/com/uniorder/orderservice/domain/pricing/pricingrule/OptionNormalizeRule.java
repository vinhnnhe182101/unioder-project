package com.uniorder.orderservice.domain.pricing.pricingrule;

import com.uniorder.orderservice.domain.option.OptionNormalizer;
import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.entity.OrderItemEntity;
import com.uniorder.orderservice.entity.OrderItemOptionEntity;

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
