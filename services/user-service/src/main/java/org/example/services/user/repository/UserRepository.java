package org.example.services.user.repository;

import org.example.services.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);

    @Query("SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.userRoles ur " +
            "LEFT JOIN FETCH ur.role " +
            "WHERE u.userId = :id")
    Optional<UserEntity> findByIdWithRoles(@Param("id") Long id);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByVerificationToken(String verificationToken);

    Optional<UserEntity> findByResetPasswordToken(String token);


}
