package com.uniorder.catalogservice.service;

import com.uniorder.catalog.dto.request.CreateCategoryRequest;
import com.uniorder.catalog.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CreateCategoryRequest createCategoryRequest);

    List<CategoryResponse> getAllCategories();
}
