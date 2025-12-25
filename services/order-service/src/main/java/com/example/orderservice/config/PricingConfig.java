package com.example.orderservice.config;

import com.example.orderservice.domain.pricing.DefaultOrderPricingStrategy;
import com.example.orderservice.domain.pricing.OrderPricingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PricingConfig {
    @Bean
    public OrderPricingStrategy orderPricingStrategy() {
        return new DefaultOrderPricingStrategy();
    }
}
