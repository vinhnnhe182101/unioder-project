package org.example.catalogservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentConfigResponse {
    private String bankId;
    private String accountNo;
    private String accountName;
}
