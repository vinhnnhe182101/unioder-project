package com.uniorder.orderservice.service.impl;

import com.uniorder.orderservice.client.CatalogClient;
import com.uniorder.orderservice.config.RestaurantContext;
import com.uniorder.orderservice.dto.external.PaymentConfigDto;
import com.uniorder.orderservice.dto.request.CreatePaymentRequest;
import com.uniorder.orderservice.dto.response.PaymentResponse;
import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.entity.PaymentEntity;
import com.uniorder.orderservice.enums.OrderStatus;
import com.uniorder.orderservice.enums.PaymentMethod;
import com.uniorder.orderservice.enums.PaymentStatus;
import com.uniorder.orderservice.repository.OrderRepository;
import com.uniorder.orderservice.repository.PaymentRepository;
import com.uniorder.orderservice.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    private PaymentRepository paymentRepository;
    private OrderRepository orderRepository;
    private CatalogClient catalogClient;

    public PaymentServiceImpl(PaymentRepository paymentRepository, OrderRepository orderRepository, CatalogClient catalogClient) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.catalogClient = catalogClient;
    }

    @Transactional
    @Override
    public PaymentResponse createPayment(Long orderId, CreatePaymentRequest request) {

        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) throw new RuntimeException("Unauthorized: Missing Restaurant ID");

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getRestId().equals(restId)) {
            throw new RuntimeException("Unauthorized: Order belongs to another restaurant");
        }

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new RuntimeException("Cannot pay for a CANCELLED or COMPLETED order");
        }

        PaymentEntity payment = PaymentEntity.builder()
                .order(order)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.PENDING)
                .build();

        String qrUrl = null;

        if (request.getMethod() == PaymentMethod.BANK_TRANSFER) {
            PaymentConfigDto bankConfig = catalogClient.getPaymentConfig(order.getRestId());

            if (bankConfig == null || bankConfig.getAccountNo() == null) {
                throw new RuntimeException("Nhà hàng chưa cấu hình tài khoản ngân hàng để nhận chuyển khoản!");
            }

            String content = "TT DON " + order.getOrderNumber();
            String contentEncoded = content.replace(" ", "%20");

            qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact.png?amount=%s&addInfo=%s&accountName=%s",
                    bankConfig.getBankId(),
                    bankConfig.getAccountNo(),
                    request.getAmount().longValue(),
                    contentEncoded,
                    bankConfig.getAccountName());

        } else if (request.getMethod() == PaymentMethod.CASH) {
            payment.setStatus(PaymentStatus.SUCCEEDED);
            payment.setPaidAt(LocalDateTime.now());

            updateOrderStatusAfterPayment(order);
        } else if (request.getMethod() == PaymentMethod.COD) {
        }

        PaymentEntity savedPayment = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .paymentId(savedPayment.getPaymentId())
                .amount(savedPayment.getAmount())
                .method(savedPayment.getMethod())
                .status(savedPayment.getStatus())
                .qrUrl(qrUrl)
                .build();
    }

    @Transactional
    @Override
    public void confirmPayment(Long paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
            return;
        }

        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        updateOrderStatusAfterPayment(payment.getOrder());
    }

    @Override
    public void updateOrderStatusAfterPayment(OrderEntity order) {
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);
    }
}
