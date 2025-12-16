package org.example.catalogservice.service;

import org.example.catalog.dto.request.CreateProductRequest;
import org.example.catalog.dto.response.ProductResponse;
import org.example.catalogservice.repository.CategoryRepository;
import org.example.catalogservice.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(CreateProductRequest request, MultipartFile file);

    ProductResponse updateProduct(Long productId, CreateProductRequest request, MultipartFile file);

    void deleteProduct(Long productId);

    List<ProductResponse> getMyProducts();

    ProductResponse getProductById(Long productId);

    List<ProductResponse> validateProducts(List<Long> productIds);

    List<ProductResponse> searchProducts(String keyword, Long restId);

    void toggleProductAvailability(Long productId);
}
