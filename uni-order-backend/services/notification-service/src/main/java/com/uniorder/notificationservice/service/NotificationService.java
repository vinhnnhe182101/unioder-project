package com.uniorder.notificationservice.service;

import com.uniorder.notificationservice.dto.request.NotificationRequest;
import com.uniorder.notificationservice.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface NotificationService {

    void sendNotification(NotificationRequest request);

    Page<NotificationResponse> getMyNotifications(Long restId, Long userId, Pageable pageable);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long restId, Long userId);
}
