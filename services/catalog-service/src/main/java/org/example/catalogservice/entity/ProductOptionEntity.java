package org.example.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "product_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;

    @Column(name = "rest_id", nullable = false)
    private Long restId;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_multiple_choice")
    private boolean isMultipleChoice; // Checkbox vs Radio

    @Column(name = "is_required")
    private boolean isRequired; // Bắt buộc chọn?

    @Column(name = "display_order")
    private Integer displayOrder;

    // Quan hệ 1-N với Option Items
    @OneToMany(mappedBy = "productOption", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductOptionItemEntity> optionItems;

    @OneToMany(mappedBy = "option", fetch = FetchType.LAZY)
    private List<ProductOptionAssignmentEntity> productAssignments;
}
