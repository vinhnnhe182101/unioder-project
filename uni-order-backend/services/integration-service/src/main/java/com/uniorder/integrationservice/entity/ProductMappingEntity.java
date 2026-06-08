package com.uniorder.integrationservice.entity;

import com.uniorder.integrationservice.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_mappings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMappingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mapping_id")
    private Long mappingId;

    @Column(name = "internal_product_id", nullable = false)
    private Long internalProductId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "platform_store_id", nullable = false)
    private PlatformStoreEntity platformStore;

    @Column(name = "external_product_id", nullable = false)
    private String externalProductId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status")
    @Builder.Default
    private SyncStatus syncStatus = SyncStatus.SYNCED;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
