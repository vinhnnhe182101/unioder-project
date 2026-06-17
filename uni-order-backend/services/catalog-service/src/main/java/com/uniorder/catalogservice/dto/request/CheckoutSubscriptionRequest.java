package com.uniorder.catalogservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutSubscriptionRequest {
    @NotBlank(message = "Vui lòng chọn gói subscription")
    private String planCode;
}
