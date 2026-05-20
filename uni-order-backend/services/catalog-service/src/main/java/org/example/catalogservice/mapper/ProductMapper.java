package org.example.catalogservice.mapper;

import org.example.catalog.dto.request.CreateProductRequest;
import org.example.catalog.dto.response.ProductResponse;
import org.example.catalogservice.entity.ProductEntity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {

    private OptionMapper optionMapper;

    public ProductMapper(OptionMapper optionMapper) {
        this.optionMapper = optionMapper;
    }

    public ProductEntity toEntity(CreateProductRequest request) {
        return ProductEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .imgUrl(request.getImgUrl())
                .price(request.getPrice())
                .isAvailable(true)
                .build();
    }

    public ProductResponse toResponse(ProductEntity entity) {
        return ProductResponse.builder()
                .productId(entity.getProductId())
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .price(entity.getPrice())
                .isAvailable(entity.isAvailable())
                .options(entity.getOptionAssignments().stream()
                        .map(assignment -> optionMapper.toResponse(assignment.getOption()))
                        .collect(Collectors.toList()))
                .build();
    }
}
