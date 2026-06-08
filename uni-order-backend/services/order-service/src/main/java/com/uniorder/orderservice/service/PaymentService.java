package com.uniorder.orderservice.service;

import com.uniorder.orderservice.dto.request.CreatePaymentRequest;
import com.uniorder.orderservice.dto.response.PaymentResponse;
import com.uniorder.orderservice.entity.OrderEntity;

public interface PaymentService {

    PaymentResponse createPayment(Long orderId, CreatePaymentRequest request);

    void confirmPayment(Long paymentId);

    void updateOrderStatusAfterPayment(OrderEntity order);
}
