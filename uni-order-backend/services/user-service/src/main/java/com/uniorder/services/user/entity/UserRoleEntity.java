package com.uniorder.services.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
public class UserRoleEntity {

    @EmbeddedId
    private UserRoleIdEntity id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private RoleEntity role;

    public UserRoleEntity(UserEntity user, RoleEntity role, Long restaurantId) {
        this.user = user;
        this.role = role;

        this.id = new UserRoleIdEntity(
                user.getUserId(),
                role.getRoleId(),
                restaurantId
        );
    }
}
