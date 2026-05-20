package com.example.orderservice.dto.response;

import com.example.orderservice.enums.PaymentMethod;
import com.example.orderservice.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentResponse {
    private Long paymentId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String qrUrl;
}
