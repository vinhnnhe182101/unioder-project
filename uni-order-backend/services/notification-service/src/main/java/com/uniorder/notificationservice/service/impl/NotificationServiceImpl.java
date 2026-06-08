package com.uniorder.notificationservice.service.impl;

import com.uniorder.notificationservice.dto.request.NotificationRequest;
import com.uniorder.notificationservice.dto.response.NotificationResponse;
import com.uniorder.notificationservice.entity.NotificationEntity;
import com.uniorder.notificationservice.enums.NotificationChannel;
import com.uniorder.notificationservice.mapper.NotificationMapper;
import com.uniorder.notificationservice.repository.NotificationRepository;
import com.uniorder.notificationservice.service.NotificationService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class NotificationServiceImpl implements NotificationService {

    private NotificationRepository  notificationRepository;
    private SimpMessagingTemplate simpMessagingTemplate;
    private NotificationMapper notificationMapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository, SimpMessagingTemplate simpMessagingTemplate, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public void sendNotification(NotificationRequest request) {
        NotificationEntity notification = NotificationEntity.builder()
                .restaurantId(request.getRestaurantId())
                .title(request.getTitle())
                .content(request.getMessage())
                .channel(NotificationChannel.WEB_SOCKET)
                .type(request.getType())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        String destination = "/topic/restaurant/" + request.getRestaurantId();

        simpMessagingTemplate.convertAndSend(destination, notification);

        System.out.println("Sent notification to " + destination);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<NotificationResponse> getMyNotifications(Long restId, Long userId, Pageable pageable) {
        Page<NotificationEntity> entities = notificationRepository.findMyNotifications(restId, userId, pageable);

        return entities.map(notificationMapper::toResponse);
    }

    @Override
    public void markAsRead(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long restId, Long userId) {
        notificationRepository.markAllAsRead(restId, userId);
    }
}
