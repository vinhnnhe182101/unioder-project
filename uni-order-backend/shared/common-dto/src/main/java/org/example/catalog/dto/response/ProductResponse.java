package org.example.catalog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long productId;
    private String categoryName;
    private String name;
    private String description;
    private String imgUrl;
    private BigDecimal price;
    private boolean isAvailable;

    private List<OptionResponse> options;
}
