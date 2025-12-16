package org.example.catalogservice.repository;

import org.example.catalogservice.entity.ProductOptionItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOptionItemRepository extends JpaRepository<ProductOptionItemEntity,Long> {
}
