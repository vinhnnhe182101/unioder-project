package com.uniorder.orderservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RevenueStatsResponse {
    private String timePoint;
    private BigDecimal totalRevenue;
    private Long totalOrders;
}
