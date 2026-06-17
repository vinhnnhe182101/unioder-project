package com.uniorder.catalogservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionSummaryResponse {
    private Long restaurantId;
    private String restaurantName;
    private String restaurantStatus;
    private String planCode;
    private String planName;
    private BigDecimal amount;
    private Integer durationDays;
    private String status;
    private String paymentReference;
    private String qrUrl;
    private LocalDateTime startsAt;
    private LocalDateTime expiresAt;
    private Long daysRemaining;
    private Boolean active;
}
