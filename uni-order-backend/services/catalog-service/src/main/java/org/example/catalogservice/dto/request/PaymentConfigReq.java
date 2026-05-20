package org.example.catalogservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentConfigReq {
    @NotBlank(message = "Vui lòng chọn Ngân hàng")
    private String bankId;

    @NotBlank(message = "Vui lòng nhập Số tài khoản")
    private String accountNo;

    @NotBlank(message = "Vui lòng nhập Tên chủ tài khoản")
    private String accountName;
}