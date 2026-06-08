package com.uniorder.orderservice.dto.external;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductExternalResponse {
    private Long productId;
    private String name;
    private BigDecimal price;
    private boolean isAvailable;
}
