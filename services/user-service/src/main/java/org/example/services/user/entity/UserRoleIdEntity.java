package org.example.services.user.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserRoleIdEntity implements Serializable {

    private Long userId;

    private Integer roleId;

    private Long restaurantId;
}
