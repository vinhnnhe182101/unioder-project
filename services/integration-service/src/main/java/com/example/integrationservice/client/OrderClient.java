package com.example.integrationservice.client;

import org.example.order.request.CreateOrderRequest;
import org.example.order.response.OrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @PostMapping("/api/orders")
    OrderResponse createOrder(@RequestBody CreateOrderRequest request, @RequestHeader("x-restaurant-id") Long restId);

}
