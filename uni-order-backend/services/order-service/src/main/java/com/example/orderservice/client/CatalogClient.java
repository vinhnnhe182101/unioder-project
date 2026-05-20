package com.example.orderservice.client;

import com.example.orderservice.dto.external.PaymentConfigDto;
import com.example.orderservice.dto.external.ProductDto;
import com.example.orderservice.dto.external.ProductExternalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "CATALOG-SERVICE")
public interface CatalogClient {

    @GetMapping("/api/catalog/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);

    @PostMapping("/api/catalog/products/validate")
    List<ProductDto> validateProducts(@RequestBody List<Long> productIds);

    @GetMapping("/api/catalog/restaurants/{id}/payment-config")
    PaymentConfigDto getPaymentConfig(@PathVariable("id") Long restId);
}
