package org.example.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OptionResponse {
    private Long optionId;
    private String name;
    private boolean isMultipleChoice;
    private boolean isRequired;
    private Integer displayOrder;
    private List<OptionItemResponse> items;

    @Data
    @Builder
    public static class OptionItemResponse {
        private Long itemId;
        private String name;
        private BigDecimal extraPrice;
        private boolean isAvailable;
    }
}
