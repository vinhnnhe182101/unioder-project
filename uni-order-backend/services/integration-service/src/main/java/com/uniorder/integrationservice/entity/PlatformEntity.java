package com.uniorder.integrationservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platforms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "platform_id")
    private Integer platformId;

    @Column(nullable = false, unique = true)
    private String name; // FACEBOOK, GRABFOOD...

    @Column(name = "api_base_url", columnDefinition = "TEXT")
    private String apiBaseUrl;

    // [MỚI] Thêm trường này cho khớp DB
    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;
}
