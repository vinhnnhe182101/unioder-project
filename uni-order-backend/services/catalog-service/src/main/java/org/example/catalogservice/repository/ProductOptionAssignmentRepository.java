package org.example.catalogservice.repository;

import org.example.catalogservice.entity.ProductOptionAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOptionAssignmentRepository extends JpaRepository<ProductOptionAssignmentEntity,Long> {
}
