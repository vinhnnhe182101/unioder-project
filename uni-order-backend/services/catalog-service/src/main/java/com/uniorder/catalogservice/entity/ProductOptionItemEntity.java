package com.uniorder.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_option_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOptionItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    // Khóa ngoại tới Option Group
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private ProductOptionEntity productOption;

    @Column(nullable = false)
    private String name;

    @Column(name = "extra_price")
    private BigDecimal extraPrice;

    @Column(name = "is_available")
    private boolean isAvailable = true;

    @Column(name = "display_order")
    private Integer displayOrder;
}
