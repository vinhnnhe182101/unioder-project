package com.example.integrationservice.client;

import org.example.catalog.dto.response.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "CATALOG-SERVICE")
public interface CatalogClient {

    @GetMapping("/api/catalog/products/search")
    List<ProductResponse> searchProducts(@RequestParam("keyword") String keyword, @RequestParam("restId") Long restId);
}
