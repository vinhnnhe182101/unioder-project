package org.example.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_configs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"rest_id", "config_key"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantConfigEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "config_id")
    private Long configId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rest_id", nullable = false)
    private RestaurantEntity restaurant;

    @Column(name = "config_key", nullable = false)
    private String configKey;

    @Column(name = "config_value")
    private String configValue;
}
