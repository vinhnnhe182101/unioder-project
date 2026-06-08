package com.uniorder.catalogservice.service;

import com.uniorder.catalog.dto.request.CreateRestaurantRequest;
import com.uniorder.catalog.dto.response.RestaurantResponse;
import com.uniorder.catalogservice.dto.request.PaymentConfigReq;
import com.uniorder.catalogservice.dto.request.UpdateRestaurantRequest;
import com.uniorder.catalogservice.dto.response.PaymentConfigResponse;
import com.uniorder.catalogservice.entity.RestaurantEntity;
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
