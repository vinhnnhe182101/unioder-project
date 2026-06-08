package com.uniorder.catalogservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @PostMapping("/api/internal/users/add-restaurant-role")
    void addRestaurantRole(@RequestParam("userId") Long userId, @RequestParam("restaurantId") Long restaurantId);
}
