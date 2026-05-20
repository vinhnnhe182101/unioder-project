package com.example.integrationservice.repository;

import com.example.integrationservice.entity.PlatformStoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformStoreRepository extends JpaRepository<PlatformStoreEntity,Long> {

    Optional<PlatformStoreEntity> findByExternalStoreId(String externalStoreId);

}
