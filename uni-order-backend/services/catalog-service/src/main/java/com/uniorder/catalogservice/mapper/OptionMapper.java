package com.uniorder.catalogservice.mapper;

import com.uniorder.catalog.dto.request.CreateOptionItemRequest;
import com.uniorder.catalog.dto.request.CreateOptionRequest;
import com.uniorder.catalog.dto.response.OptionResponse;
import com.uniorder.catalogservice.entity.ProductOptionEntity;
import com.uniorder.catalogservice.entity.ProductOptionItemEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OptionMapper {
    public ProductOptionEntity toEntity(CreateOptionRequest createOptionRequest) {
        return ProductOptionEntity.builder()
                .name(createOptionRequest.getName())
                .isMultipleChoice(createOptionRequest.getIsMultipleChoice())
                .isRequired(createOptionRequest.getIsRequired())
                .displayOrder(createOptionRequest.getDisplayOrder() != null ? createOptionRequest.getDisplayOrder() : 0)
                .build();
    }

    public ProductOptionItemEntity toItemEntity(CreateOptionItemRequest request) {
        return ProductOptionItemEntity.builder()
                .name(request.getName())
                .extraPrice(request.getExtraPrice())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isAvailable(true)
                .build();
    }

    public OptionResponse toResponse(ProductOptionEntity productOptionEntity) {

        List<OptionResponse.OptionItemResponse> items = productOptionEntity.getOptionItems() == null ? Collections.emptyList() :
                productOptionEntity.getOptionItems().stream()
                        .map(item -> OptionResponse.OptionItemResponse.builder()
                                .itemId(item.getItemId())
                                .name(item.getName())
                                .extraPrice(item.getExtraPrice())
                                .isAvailable(item.isAvailable())
                                .build()
                        ).collect(Collectors.toList());

        return OptionResponse.builder()
                .optionId(productOptionEntity.getOptionId())
                .name(productOptionEntity.getName())
                .isMultipleChoice(productOptionEntity.isMultipleChoice())
                .isRequired(productOptionEntity.isRequired())
                .displayOrder(productOptionEntity.getDisplayOrder())
                .items(items)
                .build();
    }
}
