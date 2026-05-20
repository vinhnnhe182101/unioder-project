package com.example.orderservice.repository;

import com.example.orderservice.entity.OrderItemOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemOptionRepository extends JpaRepository<OrderItemOptionEntity, Long> {
}
