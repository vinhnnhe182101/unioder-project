package com.uniorder.notificationservice.repository;

import com.uniorder.notificationservice.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    @Query("SELECT n FROM NotificationEntity n WHERE n.restaurantId = :restId AND (n.recipientId IS NULL OR n.recipientId = :userId) ORDER BY n.createdAt DESC")
    Page<NotificationEntity> findMyNotifications(@Param("restId") Long restId, @Param("userId") Long userId, Pageable pageable);

    // Đếm số lượng chưa đọc
    @Query("SELECT COUNT(n) FROM NotificationEntity n WHERE n.restaurantId = :restId AND (n.recipientId IS NULL OR n.recipientId = :userId) AND n.isRead = false")
    long countUnread(@Param("restId") Long restId, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.restaurantId = :restId AND (n.recipientId IS NULL OR n.recipientId = :userId) AND n.isRead = false")
    void markAllAsRead(@Param("restId") Long restId, @Param("userId") Long userId);
}
