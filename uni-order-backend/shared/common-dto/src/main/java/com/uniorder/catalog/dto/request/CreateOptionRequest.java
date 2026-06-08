package com.uniorder.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOptionRequest {
    @NotBlank(message = "Tên nhóm tùy chọn không được để trống")
    private String name; // Vd: Mức đá

    @NotNull
    private Boolean isMultipleChoice; // false = Chọn 1, true = Chọn nhiều

    @NotNull
    private Boolean isRequired; // true = Bắt buộc chọn

    private Integer displayOrder;
}
