package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreatePaymentRequest;
import com.example.orderservice.dto.response.PaymentResponse;
import com.example.orderservice.entity.OrderEntity;

public interface PaymentService {

    PaymentResponse createPayment(Long orderId, CreatePaymentRequest request);

    void confirmPayment(Long paymentId);

    void updateOrderStatusAfterPayment(OrderEntity order);
}
