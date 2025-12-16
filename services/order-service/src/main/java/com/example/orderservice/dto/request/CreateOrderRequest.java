package com.example.orderservice.dto.request;

import com.example.orderservice.enums.OrderType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull
    private OrderType orderType; // DINE_IN, DELIVERY...

    private String note;

    @NotNull
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;
        @NotNull
        private Integer quantity;

        private String selectedOptionsJson;
    }
}
