package org.example.catalogservice.repository;

import org.example.catalogservice.entity.RestaurantConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantConfigRepository extends JpaRepository<RestaurantConfigEntity,Long> {
}
