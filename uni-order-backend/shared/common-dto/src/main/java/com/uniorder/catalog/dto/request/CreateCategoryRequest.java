package com.uniorder.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {

    @NotBlank(message = "Category name can not blank!")
    private String name;

    private String description;

    private Integer displayOrder;
}
