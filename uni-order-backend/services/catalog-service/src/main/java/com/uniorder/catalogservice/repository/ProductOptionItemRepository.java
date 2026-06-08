package com.uniorder.catalogservice.repository;

import com.uniorder.catalogservice.entity.ProductOptionItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOptionItemRepository extends JpaRepository<ProductOptionItemEntity,Long> {
}
