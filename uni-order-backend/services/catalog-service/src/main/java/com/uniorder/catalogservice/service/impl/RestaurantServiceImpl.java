package com.uniorder.catalogservice.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import com.uniorder.catalog.dto.request.CreateRestaurantRequest;
import com.uniorder.catalog.dto.response.RestaurantResponse;
import com.uniorder.catalogservice.client.UserClient;
import com.uniorder.catalogservice.config.RestaurantContext;
import com.uniorder.catalogservice.dto.request.PaymentConfigReq;
import com.uniorder.catalogservice.dto.request.UpdateRestaurantRequest;
import com.uniorder.catalogservice.dto.response.PaymentConfigResponse;
import com.uniorder.catalogservice.entity.RestaurantConfigEntity;
import com.uniorder.catalogservice.entity.RestaurantEntity;
import com.uniorder.catalogservice.enums.RestaurantConfigKey;
import com.uniorder.catalogservice.mapper.RestaurantMapper;
import com.uniorder.catalogservice.repository.RestaurantConfigRepository;
import com.uniorder.catalogservice.repository.RestaurantRepository;
import com.uniorder.catalogservice.service.RestaurantService;
import com.uniorder.common.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.Key;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    private RestaurantRepository restaurantRepository;
    private RestaurantMapper restaurantMapper;
    private UserClient userClient;
    private FileStorageUtil fileStorageUtil;
    private RestaurantConfigRepository restaurantConfigRepository;


    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    public RestaurantServiceImpl(
            RestaurantRepository restaurantRepository,
            RestaurantMapper restaurantMapper,
            UserClient userClient,
            FileStorageUtil fileStorageUtil,
            RestaurantConfigRepository restaurantConfigRepository) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantMapper = restaurantMapper;
        this.userClient = userClient;
        this.fileStorageUtil = fileStorageUtil;
        this.restaurantConfigRepository = restaurantConfigRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public RestaurantResponse createRestaurant(CreateRestaurantRequest request, MultipartFile file, String token) {
        Long userId = getUserIdFromToken(token);

        RestaurantEntity restaurantEntity = restaurantMapper.toEntity(request, userId);

        if (file != null && !file.isEmpty()) {
            String logoUrl = fileStorageUtil.storeImage(file, "restaurants");
            restaurantEntity.setLogoUrl(logoUrl);
        }

        RestaurantEntity savedRestaurantEntity = restaurantRepository.save(restaurantEntity);

        try {
            userClient.addRestaurantRole(userId, savedRestaurantEntity.getRestId());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đồng bộ quyền: " + e.getMessage());
        }

        return restaurantMapper.toResponse(savedRestaurantEntity);
    }

    @Transactional(readOnly = true)
    @Override
    public List<RestaurantResponse> getMyRestaurants(String token) {
        Long userId = getUserIdFromToken(token);

        List<RestaurantEntity> restaurantEntities = restaurantRepository.findByOwnerId(userId);

        return restaurantEntities.stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public PaymentConfigResponse getPaymentConfig(Long restId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        List<RestaurantConfigEntity> configs =
                restaurantConfigRepository.findByRestaurant_RestId(restId);

        PaymentConfigResponse response = new PaymentConfigResponse();

        for (RestaurantConfigEntity cfg : restaurant.getConfigs()) {
            switch (RestaurantConfigKey.valueOf(cfg.getConfigKey())) {
                case BANK_ID -> response.setBankId(cfg.getConfigValue());
                case ACCOUNT_NO -> response.setAccountNo(cfg.getConfigValue());
                case ACCOUNT_NAME -> response.setAccountName(cfg.getConfigValue());
            }
        }

        return response;
    }

    @Transactional
    @Override
    public void updatePaymentConfig(Long restId, PaymentConfigReq request) {
        RestaurantEntity restaurant = restaurantRepository.findById(restId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        saveOrUpdateConfig(restaurant, "BANK_ID", request.getBankId());
        saveOrUpdateConfig(restaurant, "ACCOUNT_NO", request.getAccountNo());
        saveOrUpdateConfig(restaurant, "ACCOUNT_NAME", request.getAccountName());
    }

    @Override
    public void saveOrUpdateConfig(RestaurantEntity restaurant, String key, String value) {
        Optional<RestaurantConfigEntity> existing = restaurantConfigRepository.findByRestaurantAndConfigKey(restaurant, key);
        if (existing.isPresent()) {
            existing.get().setConfigValue(value);
            restaurantConfigRepository.save(existing.get());
        } else {
            RestaurantConfigEntity newConfig = RestaurantConfigEntity.builder()
                    .restaurant(restaurant)
                    .configKey(key)
                    .configValue(value)
                    .build();
            restaurantConfigRepository.save(newConfig);
        }
    }

    @Override
    @Transactional
    public RestaurantResponse updateRestaurant(Long restId, UpdateRestaurantRequest request, MultipartFile logoFile) {
        Long contextRestId = RestaurantContext.getRestaurantId();
        if (contextRestId == null || !contextRestId.equals(restId)) {
            throw new RuntimeException("Unauthorized: Bạn đang cố sửa nhà hàng không được chọn");
        }

        RestaurantEntity restaurant = restaurantRepository.findById(restId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (request.getName() != null) restaurant.setName(request.getName());
        if (request.getAddress() != null) restaurant.setAddress(request.getAddress());
        if (request.getPhoneNumber() != null) restaurant.setPhoneNumber(request.getPhoneNumber());
        if (request.getDescription() != null) restaurant.setDescription(request.getDescription());

        if (logoFile != null && !logoFile.isEmpty()) {
            if (restaurant.getLogoUrl() != null) {
                fileStorageUtil.deleteFile(restaurant.getLogoUrl());
            }
            String logoUrl = fileStorageUtil.storeImage(logoFile, "restaurants");
            restaurant.setLogoUrl(logoUrl);
        }

        return restaurantMapper.toResponse(restaurantRepository.save(restaurant));
    }

    private Long getUserIdFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            Key key = Keys.hmacShaKeyFor(keyBytes);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("userId", Long.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Token: " + e.getMessage());
        }
    }
}
