package com.uniorder.catalogservice.repository;

import com.uniorder.catalogservice.entity.ProductOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductOptionRepository extends JpaRepository<ProductOptionEntity,Long> {

    List<ProductOptionEntity> findByRestId(Long restId);
}
