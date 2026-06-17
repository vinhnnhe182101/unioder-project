package com.uniorder.catalogservice.service.impl;

import com.uniorder.catalogservice.dto.request.CheckoutSubscriptionRequest;
import com.uniorder.catalogservice.dto.response.SubscriptionCheckoutResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionPlanResponse;
import com.uniorder.catalogservice.dto.response.SubscriptionSummaryResponse;
import com.uniorder.catalogservice.entity.RestaurantConfigEntity;
import com.uniorder.catalogservice.entity.RestaurantEntity;
import com.uniorder.catalogservice.enums.SubscriptionPlanCode;
import com.uniorder.catalogservice.enums.SubscriptionStatus;
import com.uniorder.catalogservice.repository.RestaurantConfigRepository;
import com.uniorder.catalogservice.repository.RestaurantRepository;
import com.uniorder.catalogservice.service.MerchantSubscriptionService;
import com.uniorder.catalogservice.service.RestaurantService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MerchantSubscriptionServiceImpl implements MerchantSubscriptionService {

    private static final String KEY_PLAN_CODE = "SUB_PLAN_CODE";
    private static final String KEY_PLAN_NAME = "SUB_PLAN_NAME";
    private static final String KEY_PLAN_AMOUNT = "SUB_PLAN_AMOUNT";
    private static final String KEY_PLAN_DURATION_DAYS = "SUB_PLAN_DURATION_DAYS";
    private static final String KEY_STATUS = "SUB_STATUS";
    private static final String KEY_STARTS_AT = "SUB_STARTS_AT";
    private static final String KEY_EXPIRES_AT = "SUB_EXPIRES_AT";
    private static final String KEY_PAYMENT_REFERENCE = "SUB_PAYMENT_REFERENCE";
    private static final String KEY_QR_URL = "SUB_QR_URL";
    private static final String KEY_PAYMENT_NOTE = "SUB_PAYMENT_NOTE";

    private final RestaurantRepository restaurantRepository;
    private final RestaurantConfigRepository restaurantConfigRepository;
    private final RestaurantService restaurantService;

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${subscription.payment.bank-id:970436}")
    private String bankId;

    @Value("${subscription.payment.account-no:0123456789}")
    private String accountNo;

    @Value("${subscription.payment.account-name:UNIORDER SUBSCRIPTION}")
    private String accountName;

    public MerchantSubscriptionServiceImpl(
            RestaurantRepository restaurantRepository,
            RestaurantConfigRepository restaurantConfigRepository,
            RestaurantService restaurantService
    ) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantConfigRepository = restaurantConfigRepository;
        this.restaurantService = restaurantService;
    }

    @Override
    public List<SubscriptionPlanResponse> getPlans() {
        return java.util.Arrays.stream(SubscriptionPlanCode.values())
                .map(plan -> SubscriptionPlanResponse.builder()
                        .code(plan.getCode())
                        .name(plan.getDisplayName())
                        .description(plan.getDescription())
                        .amount(plan.getAmount())
                        .durationDays(plan.getDurationDays())
                        .features(plan.getFeatures())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<SubscriptionSummaryResponse> getMySubscriptions(String token) {
        Long userId = getUserIdFromToken(token);
        return restaurantRepository.findByOwnerId(userId)
                .stream()
                .map(this::buildSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public SubscriptionCheckoutResponse checkout(Long restaurantId, CheckoutSubscriptionRequest request, String token) {
        Long userId = getUserIdFromToken(token);
        RestaurantEntity restaurant = getOwnedRestaurant(restaurantId, userId);
        SubscriptionPlanCode plan = SubscriptionPlanCode.fromCode(request.getPlanCode());
        SubscriptionSummaryResponse current = buildSummary(restaurant);

        if (Boolean.TRUE.equals(current.getActive())) {
            throw new RuntimeException("Nhà hàng đang có gói subscription còn hiệu lực");
        }

        String paymentReference = buildPaymentReference(restaurantId, plan);
        String paymentNote = buildPaymentNote(restaurantId, plan);
        String qrUrl = buildQrUrl(plan.getAmount(), paymentReference, restaurant.getName());

        saveConfig(restaurant, KEY_PLAN_CODE, plan.getCode());
        saveConfig(restaurant, KEY_PLAN_NAME, plan.getDisplayName());
        saveConfig(restaurant, KEY_PLAN_AMOUNT, plan.getAmount().toPlainString());
        saveConfig(restaurant, KEY_PLAN_DURATION_DAYS, String.valueOf(plan.getDurationDays()));
        saveConfig(restaurant, KEY_STATUS, SubscriptionStatus.PENDING_PAYMENT.name());
        saveConfig(restaurant, KEY_PAYMENT_REFERENCE, paymentReference);
        saveConfig(restaurant, KEY_QR_URL, qrUrl);
        saveConfig(restaurant, KEY_PAYMENT_NOTE, paymentNote);

        return SubscriptionCheckoutResponse.builder()
                .restaurantId(restaurant.getRestId())
                .restaurantName(restaurant.getName())
                .planCode(plan.getCode())
                .planName(plan.getDisplayName())
                .amount(plan.getAmount())
                .status(SubscriptionStatus.PENDING_PAYMENT.name())
                .paymentReference(paymentReference)
                .qrUrl(qrUrl)
                .paymentNote(paymentNote)
                .build();
    }

    @Transactional
    @Override
    public SubscriptionSummaryResponse activate(Long restaurantId, String token) {
        Long userId = getUserIdFromToken(token);
        RestaurantEntity restaurant = getOwnedRestaurant(restaurantId, userId);
        SubscriptionPlanCode plan = getCurrentPlan(restaurant)
                .orElseThrow(() -> new RuntimeException("Chưa có gói subscription để kích hoạt"));

        LocalDateTime startsAt = LocalDateTime.now();
        LocalDateTime expiresAt = startsAt.plusDays(plan.getDurationDays());

        saveConfig(restaurant, KEY_STATUS, SubscriptionStatus.ACTIVE.name());
        saveConfig(restaurant, KEY_STARTS_AT, startsAt.toString());
        saveConfig(restaurant, KEY_EXPIRES_AT, expiresAt.toString());

        return buildSummary(restaurant);
    }

    private RestaurantEntity getOwnedRestaurant(Long restaurantId, Long userId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Restaurant belongs to another merchant");
        }

        return restaurant;
    }

    private SubscriptionSummaryResponse buildSummary(RestaurantEntity restaurant) {
        Optional<SubscriptionPlanCode> planOpt = getCurrentPlan(restaurant);
        if (planOpt.isEmpty()) {
            return SubscriptionSummaryResponse.builder()
                    .restaurantId(restaurant.getRestId())
                    .restaurantName(restaurant.getName())
                    .restaurantStatus(restaurant.getStatus().name())
                    .status(SubscriptionStatus.NONE.name())
                    .active(false)
                    .build();
        }

        SubscriptionPlanCode plan = planOpt.get();
        String statusValue = getConfigValue(restaurant, KEY_STATUS);
        LocalDateTime startsAt = parseDateTime(getConfigValue(restaurant, KEY_STARTS_AT));
        LocalDateTime expiresAt = parseDateTime(getConfigValue(restaurant, KEY_EXPIRES_AT));
        SubscriptionStatus status = resolveStatus(statusValue, expiresAt);
        boolean active = status == SubscriptionStatus.ACTIVE;
        Long daysRemaining = expiresAt == null ? null : ChronoUnit.DAYS.between(LocalDateTime.now(), expiresAt);

        return SubscriptionSummaryResponse.builder()
                .restaurantId(restaurant.getRestId())
                .restaurantName(restaurant.getName())
                .restaurantStatus(restaurant.getStatus().name())
                .planCode(plan.getCode())
                .planName(plan.getDisplayName())
                .amount(plan.getAmount())
                .durationDays(plan.getDurationDays())
                .status(status.name())
                .paymentReference(getConfigValue(restaurant, KEY_PAYMENT_REFERENCE))
                .qrUrl(getConfigValue(restaurant, KEY_QR_URL))
                .startsAt(startsAt)
                .expiresAt(expiresAt)
                .daysRemaining(daysRemaining)
                .active(active)
                .build();
    }

    private Optional<SubscriptionPlanCode> getCurrentPlan(RestaurantEntity restaurant) {
        String planCode = getConfigValue(restaurant, KEY_PLAN_CODE);
        if (planCode == null || planCode.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(SubscriptionPlanCode.fromCode(planCode));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private SubscriptionStatus resolveStatus(String statusValue, LocalDateTime expiresAt) {
        SubscriptionStatus status = SubscriptionStatus.NONE;
        if (statusValue != null && !statusValue.isBlank()) {
            try {
                status = SubscriptionStatus.valueOf(statusValue);
            } catch (Exception ignored) {
                status = SubscriptionStatus.NONE;
            }
        }

        if (status == SubscriptionStatus.ACTIVE && expiresAt != null && expiresAt.isBefore(LocalDateTime.now())) {
            return SubscriptionStatus.EXPIRED;
        }
        return status;
    }

    private void saveConfig(RestaurantEntity restaurant, String key, String value) {
        restaurantService.saveOrUpdateConfig(restaurant, key, value);
    }

    private String getConfigValue(RestaurantEntity restaurant, String key) {
        return restaurantConfigRepository.findByRestaurantAndConfigKey(restaurant, key)
                .map(RestaurantConfigEntity::getConfigValue)
                .orElse(null);
    }

    private String buildPaymentReference(Long restaurantId, SubscriptionPlanCode plan) {
        return String.format("SUB-%s-%s-%s", restaurantId, plan.getCode(), LocalDateTime.now().toString().replace(":", "").replace("-", ""));
    }

    private String buildPaymentNote(Long restaurantId, SubscriptionPlanCode plan) {
        return String.format("UNIORDER SUB %s %s", restaurantId, plan.getCode());
    }

    private String buildQrUrl(BigDecimal amount, String reference, String restaurantName) {
        String info = ("UNIORDER " + reference + " " + restaurantName).replace(" ", "%20");
        String safeAccountName = accountName.replace(" ", "%20");
        return String.format(
                "https://img.vietqr.io/image/%s-%s-compact.png?amount=%s&addInfo=%s&accountName=%s",
                bankId,
                accountNo,
                amount.longValue(),
                info,
                safeAccountName
        );
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value);
        } catch (Exception ex) {
            return null;
        }
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

