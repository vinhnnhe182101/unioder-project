package com.uniorder.catalogservice.repository;

import com.uniorder.catalogservice.entity.ProductOptionAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOptionAssignmentRepository extends JpaRepository<ProductOptionAssignmentEntity,Long> {
}
