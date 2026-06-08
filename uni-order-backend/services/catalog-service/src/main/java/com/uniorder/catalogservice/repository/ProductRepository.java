package com.uniorder.catalogservice.repository;

import com.uniorder.catalogservice.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {

    List<ProductEntity> findByRestaurant_RestId(Long restId);

    List<ProductEntity> findByNameContainingIgnoreCase(String keyword);

    List<ProductEntity> findByRestaurant_RestIdAndNameContainingIgnoreCase(Long restId, String keyword);
}
