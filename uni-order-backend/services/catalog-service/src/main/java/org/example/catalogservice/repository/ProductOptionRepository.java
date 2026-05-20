package org.example.catalogservice.repository;

import org.example.catalog.dto.response.OptionResponse;
import org.example.catalogservice.entity.ProductOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductOptionRepository extends JpaRepository<ProductOptionEntity,Long> {

    List<ProductOptionEntity> findByRestId(Long restId);
}
