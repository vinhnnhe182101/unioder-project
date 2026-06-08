package com.uniorder.catalogservice.service;

import com.uniorder.catalog.dto.request.CreateProductRequest;
import com.uniorder.catalog.dto.response.ProductResponse;
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
