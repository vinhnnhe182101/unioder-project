package com.uniorder.catalog.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductRequest {
    @NotNull(message = "Category must not blank!")
    private Long categoryId;

    @NotBlank(message = "Product name must not blank!")
    private String name;

    private String description;
    private String imgUrl;
    private String sku;

    @NotNull(message = "Price must not blank!")
    @Min(value = 0, message = "Price at least 0!")
    private BigDecimal price;

    private List<Long> optionIds;
}
