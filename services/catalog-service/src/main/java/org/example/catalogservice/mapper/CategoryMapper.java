package org.example.catalogservice.mapper;

import org.example.catalog.dto.request.CreateCategoryRequest;
import org.example.catalog.dto.response.CategoryResponse;
import org.example.catalogservice.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryEntity toEntity(CreateCategoryRequest createCategoryRequest) {
        return CategoryEntity.builder()
                .name(createCategoryRequest.getName())
                .description(createCategoryRequest.getDescription())
                .displayOrder(createCategoryRequest.getDisplayOrder())
                .isActive(true)
                .build();
    }

    public CategoryResponse toResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .categoryId(entity.getCategoryId())
                .name(entity.getName())
                .description(entity.getDescription())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.isActive())
                .build();
    }
}
