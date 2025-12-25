package org.example.catalogservice.controller;

import jakarta.validation.Valid;
import org.example.catalog.dto.request.CreateRestaurantRequest;
import org.example.catalog.dto.response.RestaurantResponse;
import org.example.catalogservice.dto.request.PaymentConfigReq;
import org.example.catalogservice.dto.request.UpdateRestaurantRequest;
import org.example.catalogservice.dto.response.PaymentConfigResponse;
import org.example.catalogservice.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @RequestPart("data") @Valid CreateRestaurantRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(restaurantService.createRestaurant(request, file, token));
    }

    @GetMapping("/my-restaurants")
    public ResponseEntity<List<RestaurantResponse>> getMyRestaurants(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(restaurantService.getMyRestaurants(token));
    }

    @GetMapping("/{id}/payment-config")
    public ResponseEntity<PaymentConfigResponse> getPaymentConfig(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getPaymentConfig(id));
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<RestaurantResponse> updateRestaurant(
            @PathVariable Long id,
            @RequestPart("data") UpdateRestaurantRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, request, file));
    }

    @PutMapping("/{id}/payment-config")
    public ResponseEntity<Void> updatePaymentConfig(
            @PathVariable Long id,
            @RequestBody @Valid PaymentConfigReq request
    ) {
        restaurantService.updatePaymentConfig(id, request);
        return ResponseEntity.ok().build();
    }
}
