package com.uniorder.catalogservice.controller;

import jakarta.validation.Valid;
import com.uniorder.catalog.dto.request.CreateCategoryRequest;
import com.uniorder.catalog.dto.response.CategoryResponse;
import com.uniorder.catalogservice.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest createCategoryRequest
    ) {
        return ResponseEntity.ok().body(categoryService.createCategory(createCategoryRequest));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getMyCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

}
