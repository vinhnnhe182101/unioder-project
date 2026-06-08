package com.uniorder.orderservice.entity;

import com.uniorder.orderservice.enums.OrderStatus;
import com.uniorder.orderservice.enums.OrderType;
import com.uniorder.orderservice.enums.PrintStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "rest_id", nullable = false)
    private Long restId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "platform_connection_id")
    private Long platformConnectionId;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false)
    private OrderType orderType;

    // --- Tiền nong ---
    @Column(name = "subtotal_amount", nullable = false)
    @Builder.Default
    private BigDecimal subtotalAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "shipping_fee", nullable = false)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    // --- JSON Data ---
    @Column(name = "shipping_address", columnDefinition = "json")
    private String shippingAddress;

    @Column(name = "delivery_info", columnDefinition = "json")
    private String deliveryInfo;

    @Column(name = "customer_snapshot", columnDefinition = "json")
    private String customerSnapshot;

    private String note;

    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;

    // [MỚI] Trạng thái in ấn (Automation)
    @Column(name = "print_status")
    @Enumerated(EnumType.STRING)
    private PrintStatus printStatus = PrintStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Relationships ---
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItemEntity> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PaymentEntity> payments;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderStatusHistoryEntity> statusHistory;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderNoteEntity> orderNotes;
}
