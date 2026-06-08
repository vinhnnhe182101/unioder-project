package com.uniorder.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private Long categoryId;
    private String name;
    private String description;
    private Integer displayOrder;
    private boolean isActive;
}
