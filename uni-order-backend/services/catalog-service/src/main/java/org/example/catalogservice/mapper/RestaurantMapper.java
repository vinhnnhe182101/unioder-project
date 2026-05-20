package org.example.catalogservice.mapper;

import org.example.catalog.dto.request.CreateRestaurantRequest;

import org.example.catalog.dto.response.RestaurantResponse;
import org.example.catalogservice.entity.RestaurantEntity;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {

    public RestaurantEntity toEntity(CreateRestaurantRequest request, Long ownerId) {
        return RestaurantEntity.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .description(request.getDescription())
                .ownerId(ownerId)
                .status(RestaurantEntity.RestaurantStatus.ACTIVE)
                .build();
    }

    public RestaurantResponse toResponse(RestaurantEntity entity) {
        return RestaurantResponse.builder()
                .restId(entity.getRestId())
                .name(entity.getName())
                .address(entity.getAddress())
                .phoneNumber(entity.getPhoneNumber())
                .logoUrl(entity.getLogoUrl())
                .description(entity.getDescription())
                .status(entity.getStatus().toString())
                .build();
    }
}
