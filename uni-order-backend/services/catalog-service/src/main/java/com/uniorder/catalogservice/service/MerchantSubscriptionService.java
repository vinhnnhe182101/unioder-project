package com.uniorder.catalogservice.service;

import com.uniorder.catalogservice.dto.request.CheckoutSubscriptionRequest;
import com.uniorder.catalogservice.dto.response.SubscriptionCheckoutResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionPlanResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionSummaryResponse;

import java.util.List;

public interface MerchantSubscriptionService {
    List<SubscriptionPlanResponse> getPlans();
    List<SubscriptionSummaryResponse> getMySubscriptions(String token);
    SubscriptionCheckoutResponse checkout(Long restaurantId, CheckoutSubscriptionRequest request, String token);
    SubscriptionSummaryResponse activate(Long restaurantId, String token);
}
