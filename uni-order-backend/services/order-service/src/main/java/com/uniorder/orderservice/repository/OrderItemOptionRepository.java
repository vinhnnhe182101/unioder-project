package com.uniorder.orderservice.repository;

import com.uniorder.orderservice.entity.OrderItemOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemOptionRepository extends JpaRepository<OrderItemOptionEntity, Long> {
}
