package org.example.order.response;

import lombok.Builder;
import lombok.Data;
import org.example.order.enums.OrderStatus;
import org.example.order.enums.OrderType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private String orderNumber;
    private OrderStatus status;
    private OrderType orderType;
    private BigDecimal totalAmount;
    private String note;
    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long orderItemId;
        private Long productId;
        private String productName;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal totalPrice;
        private String selectedOptions;
        private String note;
    }
}
