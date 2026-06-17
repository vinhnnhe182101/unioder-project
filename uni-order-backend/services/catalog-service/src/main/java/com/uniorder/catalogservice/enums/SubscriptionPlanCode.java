package com.uniorder.catalogservice.enums;

import java.math.BigDecimal;
import java.util.List;

public enum SubscriptionPlanCode {
    STARTER("STARTER", "Gói Khởi Động", new BigDecimal("299000"), 30, "Phù hợp nhà hàng mới", List.of("1 nhà hàng", "Hỗ trợ cơ bản", "QR thanh toán")),
    GROWTH("GROWTH", "Gói Tăng Trưởng", new BigDecimal("699000"), 90, "Dành cho nhà hàng muốn mở rộng", List.of("Tối đa 3 nhà hàng", "Báo cáo nâng cao", "Ưu tiên hỗ trợ")),
    PRO("PRO", "Gói Chuyên Nghiệp", new BigDecimal("1990000"), 365, "Dành cho đối tác vận hành quy mô lớn", List.of("Không giới hạn nhà hàng", "Hỗ trợ SLA", "Tính năng premium"));

    private final String code;
    private final String displayName;
    private final BigDecimal amount;
    private final int durationDays;
    private final String description;
    private final List<String> features;

    SubscriptionPlanCode(String code, String displayName, BigDecimal amount, int durationDays, String description, List<String> features) {
        this.code = code;
        this.displayName = displayName;
        this.amount = amount;
        this.durationDays = durationDays;
        this.description = description;
        this.features = features;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }
    public BigDecimal getAmount() { return amount; }
    public int getDurationDays() { return durationDays; }
    public String getDescription() { return description; }
    public List<String> getFeatures() { return features; }

    public static SubscriptionPlanCode fromCode(String code) {
        for (SubscriptionPlanCode plan : values()) {
            if (plan.code.equalsIgnoreCase(code)) {
                return plan;
            }
        }
        throw new IllegalArgumentException("Unsupported subscription plan: " + code);
    }
}
