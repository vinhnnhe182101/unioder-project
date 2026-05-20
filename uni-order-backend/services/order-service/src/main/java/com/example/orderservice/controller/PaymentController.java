package com.example.orderservice.controller;

import com.example.orderservice.dto.request.CreatePaymentRequest;
import com.example.orderservice.dto.response.PaymentResponse;
import com.example.orderservice.service.PaymentService;
import com.example.orderservice.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class PaymentController {

    private PaymentService paymentService;
    private AuthUtil authUtil;

    public PaymentController(PaymentService paymentService, AuthUtil authUtil) {
        this.paymentService = paymentService;
        this.authUtil = authUtil;
    }

    @PostMapping("/{orderId}/payments")
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Long orderId,
            @Valid @RequestBody CreatePaymentRequest request,
            @RequestHeader("Authorization") String token
    ) {
        // Có thể dùng userId để log xem ai là người thu tiền (nếu cần)
        // Long userId = authUtil.getUserIdFromToken(token);

        return ResponseEntity.ok(paymentService.createPayment(orderId, request));
    }

    @PutMapping("/payments/{paymentId}/confirm")
    public ResponseEntity<Void> confirmPayment(
            @PathVariable Long paymentId,
            @RequestHeader("Authorization") String token
    ) {
        paymentService.confirmPayment(paymentId);
        return ResponseEntity.ok().build();
    }
}
