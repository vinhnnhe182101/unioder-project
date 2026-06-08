package com.uniorder.services.user.repository;

import com.uniorder.services.user.entity.UserRoleEntity;
import com.uniorder.services.user.entity.UserRoleIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleIdEntity> {

    @Query("""
        SELECT ur 
        FROM UserRoleEntity ur
        JOIN FETCH ur.user u
        JOIN FETCH ur.role r
        WHERE ur.id.restaurantId = :restaurantId
    """)
    List<UserRoleEntity> findAllByRestaurantId(@Param("restaurantId") Long restaurantId);

    boolean existsById_RestaurantIdAndId_UserIdAndId_RoleId(
            Long restaurantId,
            Long userId,
            Integer roleId
    );

    void deleteById_RestaurantIdAndId_UserId(Long restaurantId, Long userId);

    void deleteById_RestaurantIdAndId_UserIdAndId_RoleId(
            Long restaurantId,
            Long userId,
            Integer roleId
    );
}
