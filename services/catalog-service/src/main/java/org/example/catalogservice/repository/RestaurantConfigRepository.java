package org.example.catalogservice.repository;

import org.example.catalogservice.entity.RestaurantConfigEntity;
import org.example.catalogservice.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantConfigRepository extends JpaRepository<RestaurantConfigEntity,Long> {

    List<RestaurantConfigEntity> findByRestaurant_RestId(Long restId);

    Optional<RestaurantConfigEntity> findByRestaurantAndConfigKey(RestaurantEntity restaurant, String key);
}
