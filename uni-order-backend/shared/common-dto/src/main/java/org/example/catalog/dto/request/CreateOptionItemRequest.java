package org.example.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOptionItemRequest {
    @NotBlank(message = "Tên lựa chọn không được để trống")
    private String name; // Vd: 50% Đá

    private BigDecimal extraPrice; // Vd: 0 hoặc 5000

    private Integer displayOrder;
}
