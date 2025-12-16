package com.example.orderservice.service.impl;

import com.example.orderservice.client.CatalogClient;
import com.example.orderservice.client.NotificationClient;
import com.example.orderservice.config.RestaurantContext;
import com.example.orderservice.dto.external.NotificationRequest;
import com.example.orderservice.dto.external.ProductDto;
import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.entity.OrderEntity;
import com.example.orderservice.entity.OrderItemEntity;
import com.example.orderservice.entity.OrderStatusHistoryEntity;
import com.example.orderservice.enums.OrderStatus;
import com.example.orderservice.mapper.OrderMapper;
import com.example.orderservice.repository.OrderRepository;
import com.example.orderservice.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private OrderRepository orderRepository;

    private CatalogClient catalogClient;

    private OrderMapper orderMapper;

    private NotificationClient notificationClient;

    public OrderServiceImpl(OrderRepository orderRepository, CatalogClient catalogClient, OrderMapper orderMapper,  NotificationClient notificationClient) {
        this.orderRepository = orderRepository;
        this.catalogClient = catalogClient;
        this.orderMapper = orderMapper;
        this.notificationClient = notificationClient;
    }

    @Transactional
    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) throw new RuntimeException("Unauthorized: Missing Restaurant ID");

        OrderEntity order = OrderEntity.builder()
                .restId(restId)
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .status(OrderStatus.PENDING)
                .orderType(request.getOrderType())
                .note(request.getNote())
                .items(new ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            // A. Gọi Catalog lấy giá gốc mới nhất
            ProductDto productInfo = catalogClient.getProductById(itemRequest.getProductId());

            if (productInfo == null || !productInfo.isAvailable()) {
                throw new RuntimeException("Sản phẩm không tồn tại hoặc hết hàng: ID " + itemRequest.getProductId());
            }

            BigDecimal unitPrice = productInfo.getPrice();

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .productId(productInfo.getProductId())
                    .productName(productInfo.getName())
                    .productImage(productInfo.getImgUrl())
                    .unitPrice(unitPrice)
                    .quantity(itemRequest.getQuantity())
                    .totalPrice(itemTotal)
                    .selectedOptionsJson(itemRequest.getSelectedOptionsJson())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        OrderEntity savedOrder = orderRepository.save(order);

        try {
            NotificationRequest notiReq = NotificationRequest.builder()
                    .restaurantId(restId)
                    .title("Đơn hàng mới #" + savedOrder.getOrderNumber())
                    .message("Có đơn hàng mới trị giá " + savedOrder.getTotalAmount() + "đ")
                    .type("ORDER_CREATED")
                    .build();

            notificationClient.sendNotification(notiReq);

        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        Long restId = RestaurantContext.getRestaurantId();

        // Gọi repository lấy entity
        List<OrderEntity> orders = orderRepository.findByRestIdOrderByCreatedAtDesc(restId);

        // Map sang DTO response
        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public OrderResponse updateOrderStatus(Long orderId, String newStatusStr, Long userId) {

        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) throw new RuntimeException("Unauthorized: Missing Restaurant ID");

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if(!order.getRestId().equals(restId))
            throw new RuntimeException("You are not allowed to update this order");

        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status not valid: " + newStatusStr);
        }

        if (order.getStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Order cancelled");

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        OrderStatusHistoryEntity history = OrderStatusHistoryEntity.builder()
                .order(order)
                .previousStatus(oldStatus)
                .newStatus(newStatus)
                .changedByUserId(userId)
                .reason("Cập nhật thủ công")
                .changedAt(LocalDateTime.now())
                .build();

        if (order.getStatusHistory() == null) {
            order.setStatusHistory(new ArrayList<>());
        }
        order.getStatusHistory().add(history);

        OrderEntity savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Transactional
    @Override
    public OrderResponse cancelOrder(Long orderId, String reason, Long userId) {
        Long restId = RestaurantContext.getRestaurantId();
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!order.getRestId().equals(restId)) throw new RuntimeException("Unauthorized");

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);

        OrderStatusHistoryEntity history = OrderStatusHistoryEntity.builder()
                .order(order)
                .previousStatus(oldStatus)
                .newStatus(OrderStatus.CANCELLED)
                .changedByUserId(userId)
                .reason(reason)
                .changedAt(LocalDateTime.now())
                .build();

        if (order.getStatusHistory() == null) order.setStatusHistory(new ArrayList<>());
        order.getStatusHistory().add(history);

        OrderEntity savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }
}
