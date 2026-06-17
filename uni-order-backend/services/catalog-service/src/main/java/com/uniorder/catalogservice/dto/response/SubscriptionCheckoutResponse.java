package com.uniorder.catalogservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCheckoutResponse {
    private Long restaurantId;
    private String restaurantName;
    private String planCode;
    private String planName;
    private BigDecimal amount;
    private String status;
    private String paymentReference;
    private String qrUrl;
    private String paymentNote;
}
