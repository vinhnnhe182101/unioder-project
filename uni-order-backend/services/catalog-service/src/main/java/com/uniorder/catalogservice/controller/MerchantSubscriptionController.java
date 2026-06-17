package com.uniorder.catalogservice.controller;

import com.uniorder.catalogservice.dto.request.CheckoutSubscriptionRequest;
import com.uniorder.catalogservice.dto.response.SubscriptionCheckoutResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionPlanResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionSummaryResponse;
import com.uniorder.catalogservice.service.MerchantSubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/subscriptions")
public class MerchantSubscriptionController {

    private final MerchantSubscriptionService subscriptionService;

    public MerchantSubscriptionController(MerchantSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanResponse>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getPlans());
    }

    @GetMapping("/me")
    public ResponseEntity<List<SubscriptionSummaryResponse>> getMySubscriptions(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(subscriptionService.getMySubscriptions(token));
    }

    @PostMapping("/restaurants/{restaurantId}/checkout")
    public ResponseEntity<SubscriptionCheckoutResponse> checkout(
            @PathVariable Long restaurantId,
            @Valid @RequestBody CheckoutSubscriptionRequest request,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(subscriptionService.checkout(restaurantId, request, token));
    }

    @PostMapping("/restaurants/{restaurantId}/activate")
    public ResponseEntity<SubscriptionSummaryResponse> activate(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(subscriptionService.activate(restaurantId, token));
    }
}
