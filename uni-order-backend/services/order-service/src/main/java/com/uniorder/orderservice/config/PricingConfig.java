package com.uniorder.orderservice.config;

import com.uniorder.orderservice.domain.pricing.DefaultOrderPricingStrategy;
import com.uniorder.orderservice.domain.pricing.OrderPricingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PricingConfig {
    @Bean
    public OrderPricingStrategy orderPricingStrategy() {
        return new DefaultOrderPricingStrategy();
    }
}
