package com.uniorder.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    // Link tới nhà hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rest_id", nullable = false)
    private RestaurantEntity restaurant;

    // Link tới danh mục
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    @Column(nullable = false)
    private String name;

    private String sku;
    private String description;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<ProductOptionAssignmentEntity> optionAssignments = new ArrayList<>();

    public void addOption(ProductOptionEntity option, int order) {
        if (this.optionAssignments == null) {
            this.optionAssignments = new ArrayList<>();
        }

        ProductOptionAssignmentEntity assignment = ProductOptionAssignmentEntity.builder()
                .product(this)
                .option(option)
                .displayOrder(order)
                .build();
        this.optionAssignments.add(assignment);
    }

    public void removeOption(ProductOptionEntity option) {
        if (this.optionAssignments != null) {
            this.optionAssignments.removeIf(assignment -> assignment.getOption().equals(option));
        }
    }

    public void setOptions(List<ProductOptionEntity> options) {
        if (this.optionAssignments == null) {
            this.optionAssignments = new ArrayList<>();
        }

        this.optionAssignments.clear();

    }

    public List<ProductOptionEntity> getOptions() {
        if (this.optionAssignments == null) return new ArrayList<>();
        List<ProductOptionEntity> list = new ArrayList<>();
        for (ProductOptionAssignmentEntity assignment : this.optionAssignments) {
            list.add(assignment.getOption());
        }
        return list;
    }
}
