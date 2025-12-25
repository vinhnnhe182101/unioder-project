package org.example.services.user.repository;

import org.example.services.user.entity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {

    @Query("""
        SELECT p FROM PermissionEntity p
        JOIN p.roles r
        WHERE r.roleId = :roleId
    """)
    List<PermissionEntity> findByRoleId(@Param("roleId") Long roleId);

}
