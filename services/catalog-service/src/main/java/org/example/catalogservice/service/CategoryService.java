package org.example.catalogservice.service;

import org.example.catalog.dto.request.CreateCategoryRequest;
import org.example.catalog.dto.response.CategoryResponse;
import org.example.catalogservice.entity.CategoryEntity;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CreateCategoryRequest createCategoryRequest);

    List<CategoryResponse> getAllCategories();
}
