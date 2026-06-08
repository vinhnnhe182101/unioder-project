package com.uniorder.services.user.controller;

import lombok.RequiredArgsConstructor;
import com.uniorder.services.user.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    @PostMapping("/add-restaurant-role")
    public void addRestaurantRole(
            @RequestParam Long userId,
            @RequestParam Long restaurantId
    ) {
        userService.addRestaurantOwnerRole(userId, restaurantId);
    }
}
