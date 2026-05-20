package org.example.catalogservice.service;

import org.example.catalog.dto.request.CreateRestaurantRequest;
import org.example.catalog.dto.response.RestaurantResponse;
import org.example.catalogservice.dto.request.PaymentConfigReq;
import org.example.catalogservice.dto.request.UpdateRestaurantRequest;
import org.example.catalogservice.dto.response.PaymentConfigResponse;
import org.example.catalogservice.entity.RestaurantEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RestaurantService {

    RestaurantResponse createRestaurant(CreateRestaurantRequest request, MultipartFile file, String token);

    List<RestaurantResponse> getMyRestaurants(String token);

    PaymentConfigResponse getPaymentConfig(Long restId);

    RestaurantResponse updateRestaurant(Long restId, UpdateRestaurantRequest request, MultipartFile logoFile);

    void updatePaymentConfig(Long restId, PaymentConfigReq request);

    void saveOrUpdateConfig(RestaurantEntity restaurant, String key, String value);
}
