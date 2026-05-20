package com.example.orderservice.domain.pricing;

import com.example.orderservice.domain.pricing.pricingrule.PricingRule;
import com.example.orderservice.entity.OrderEntity;

import java.util.List;

public class PricingContext {

    private final List<PricingRule> rules;

    public PricingContext(List<PricingRule> rules) {
        this.rules = rules;
    }

    public void price(OrderEntity order) {
        for (PricingRule rule : rules) {
            rule.apply(order);
        }
    }

}
