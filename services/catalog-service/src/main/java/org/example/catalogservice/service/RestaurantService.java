package org.example.catalogservice.service;

import org.example.catalog.dto.request.CreateRestaurantRequest;
import org.example.catalog.dto.response.RestaurantResponse;
import org.example.catalogservice.dto.response.PaymentConfigResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RestaurantService {

    RestaurantResponse createRestaurant(CreateRestaurantRequest request, MultipartFile file, String token);

    List<RestaurantResponse> getMyRestaurants(String token);

    PaymentConfigResponse getPaymentConfig(Long restId);
}
