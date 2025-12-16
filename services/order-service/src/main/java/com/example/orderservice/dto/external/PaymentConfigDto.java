package com.example.orderservice.dto.external;

import lombok.Data;

@Data
public class PaymentConfigDto {
    private String bankId;
    private String accountNo;
    private String accountName;
}
