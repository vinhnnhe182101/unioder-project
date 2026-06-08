package com.uniorder.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_item_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_option_id")
    private Long orderItemOptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItemEntity orderItem;

    @Column(name = "option_group_name", nullable = false)
    private String optionGroupName; // Ví dụ: "Mức đá"

    @Column(name = "option_item_name", nullable = false)
    private String optionItemName; // Ví dụ: "50%"

    @Column(name = "extra_price", nullable = false)
    private BigDecimal extraPrice;
}
