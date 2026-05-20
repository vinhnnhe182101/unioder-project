package org.example.catalogservice.service.impl;

import org.springframework.transaction.annotation.Transactional;
import org.example.catalog.dto.request.CreateCategoryRequest;
import org.example.catalog.dto.response.CategoryResponse;
import org.example.catalogservice.config.RestaurantContext;
import org.example.catalogservice.entity.CategoryEntity;
import org.example.catalogservice.entity.RestaurantEntity;
import org.example.catalogservice.mapper.CategoryMapper;
import org.example.catalogservice.repository.CategoryRepository;
import org.example.catalogservice.repository.RestaurantRepository;
import org.example.catalogservice.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private CategoryRepository categoryRepository;
    private RestaurantRepository restaurantRepository;
    private CategoryMapper  categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, RestaurantRepository restaurantRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.restaurantRepository = restaurantRepository;
        this.categoryMapper = categoryMapper;
    }

    @Transactional
    @Override
    public CategoryResponse createCategory(CreateCategoryRequest createCategoryRequest) {

        Long restId = RestaurantContext.getRestaurantId();

        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        RestaurantEntity restaurantEntity = restaurantRepository.findById(restId).orElseThrow(() -> new RuntimeException("Unauthorized request"));

        CategoryEntity categoryEntity = categoryMapper.toEntity(createCategoryRequest);

        categoryEntity.setRestaurant(restaurantEntity);

        CategoryEntity saveCategory = categoryRepository.save(categoryEntity);

        return categoryMapper.toResponse(saveCategory);
    }

    @Transactional(readOnly = true)
    @Override
    public List<CategoryResponse> getAllCategories() {

        Long restId = RestaurantContext.getRestaurantId();

        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        return categoryRepository.findByRestaurant_RestId(restId).stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }
}
