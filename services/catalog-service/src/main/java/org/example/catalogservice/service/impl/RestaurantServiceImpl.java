package org.example.catalogservice.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.example.catalog.dto.request.CreateRestaurantRequest;
import org.example.catalog.dto.response.RestaurantResponse;
import org.example.catalogservice.client.UserClient;
import org.example.catalogservice.dto.response.PaymentConfigResponse;
import org.example.catalogservice.entity.RestaurantConfigEntity;
import org.example.catalogservice.entity.RestaurantEntity;
import org.example.catalogservice.mapper.RestaurantMapper;
import org.example.catalogservice.repository.RestaurantRepository;
import org.example.catalogservice.service.RestaurantService;
import org.example.common.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.Key;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    private RestaurantRepository restaurantRepository;
    private RestaurantMapper restaurantMapper;
    private UserClient userClient;
    private FileStorageUtil fileStorageUtil;

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    public RestaurantServiceImpl(
            RestaurantRepository restaurantRepository,
            RestaurantMapper restaurantMapper,
            UserClient userClient,
            FileStorageUtil fileStorageUtil) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantMapper = restaurantMapper;
        this.userClient = userClient;
        this.fileStorageUtil = fileStorageUtil;
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

    @Override
    public PaymentConfigResponse getPaymentConfig(Long restId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Map<String, String> configMap = restaurant.getConfigs().stream()
                .collect(Collectors.toMap(RestaurantConfigEntity::getConfigKey, RestaurantConfigEntity::getConfigValue));

        return PaymentConfigResponse.builder()
                .bankId(configMap.get("BANK_ID"))
                .accountNo(configMap.get("ACCOUNT_NO"))
                .accountName(configMap.get("ACCOUNT_NAME"))
                .build();
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
