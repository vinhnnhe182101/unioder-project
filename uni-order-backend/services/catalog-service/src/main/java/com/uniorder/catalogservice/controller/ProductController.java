package com.uniorder.catalogservice.controller;

import jakarta.validation.Valid;
import com.uniorder.catalog.dto.request.CreateProductRequest;
import com.uniorder.catalog.dto.response.ProductResponse;
import com.uniorder.catalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("data") @Valid CreateProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(productService.createProduct(request, file));
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid CreateProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getMyProducts() {
        return ResponseEntity.ok(productService.getMyProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/validate")
    public ResponseEntity<List<ProductResponse>> validateProducts(@RequestBody List<Long> productIds) {
        return ResponseEntity.ok(productService.validateProducts(productIds));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(required = false) Long restId
    ) {
        return ResponseEntity.ok(productService.searchProducts(keyword, restId));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Void> toggleAvailability(@PathVariable Long id) {
        productService.toggleProductAvailability(id);
        return ResponseEntity.ok().build();
    }
}
