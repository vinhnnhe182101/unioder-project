package com.example.orderservice.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SelectedOptionDto {
    private String name;
    private String choice;
    private BigDecimal price;
}
