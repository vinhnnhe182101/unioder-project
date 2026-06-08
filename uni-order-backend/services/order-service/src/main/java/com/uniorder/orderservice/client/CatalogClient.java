package com.uniorder.orderservice.client;

import com.uniorder.orderservice.dto.external.PaymentConfigDto;
import com.uniorder.orderservice.dto.external.ProductDto;
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
