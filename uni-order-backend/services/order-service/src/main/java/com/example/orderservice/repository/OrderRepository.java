package com.example.orderservice.repository;

import com.example.orderservice.dto.response.TopProductResponse;
import com.example.orderservice.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByRestIdOrderByCreatedAtDesc(Long restId);

    @Query("SELECT o FROM OrderEntity o WHERE o.restId = :restId AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt ASC")
    List<OrderEntity> findCompletedOrdersInRange(@Param("restId") Long restId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.example.orderservice.dto.response.TopProductResponse(i.productId, i.productName, SUM(i.quantity), SUM(i.totalPrice)) " +
            "FROM OrderItemEntity i JOIN i.order o " +
            "WHERE o.restId = :restId AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY i.productId, i.productName " +
            "ORDER BY SUM(i.quantity) DESC")
    List<TopProductResponse> findTopProducts(@Param("restId") Long restId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
