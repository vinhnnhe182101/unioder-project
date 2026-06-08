package com.uniorder.order.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.uniorder.order.enums.OrderType;

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
