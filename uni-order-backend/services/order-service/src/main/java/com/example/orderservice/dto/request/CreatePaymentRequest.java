package com.example.orderservice.dto.request;

import com.example.orderservice.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {
    @NotNull
    private PaymentMethod method;

    @NotNull
    private BigDecimal amount;

    private String note;
}
