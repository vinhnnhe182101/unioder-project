package org.example.services.user.repository;

import org.example.services.user.entity.UserRoleEntity;
import org.example.services.user.entity.UserRoleIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleIdEntity> {
}
