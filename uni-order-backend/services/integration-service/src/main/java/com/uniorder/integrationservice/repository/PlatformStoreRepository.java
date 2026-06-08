package com.uniorder.integrationservice.repository;

import com.uniorder.integrationservice.entity.PlatformStoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformStoreRepository extends JpaRepository<PlatformStoreEntity,Long> {

    Optional<PlatformStoreEntity> findByExternalStoreId(String externalStoreId);

}
