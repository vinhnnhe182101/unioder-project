package com.example.orderservice.domain.pricing;

import com.example.orderservice.domain.pricing.pricingrule.*;
import com.example.orderservice.entity.OrderEntity;

import java.util.List;

public class DefaultOrderPricingStrategy implements OrderPricingStrategy {

    private final PricingContext pricingContext;

    public DefaultOrderPricingStrategy() {
        this.pricingContext = new PricingContext(List.of(
                new ItemBasePriceRule(),
                new OptionNormalizeRule(),
                new OptionPriceRule(),
                new SubtotalRule(),
                new DiscountRule(),
                new TaxRule(),
                new FinalTotalRule()
        ));
    }

    @Override
    public void price(OrderEntity order) {
        pricingContext.price(order);
    }
}
