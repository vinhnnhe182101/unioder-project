package com.uniorder.catalogservice.repository;

import com.uniorder.catalogservice.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {

    List<CategoryEntity> findByRestaurant_RestId(Long restaurantId);
}
