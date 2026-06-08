package com.uniorder.notificationservice.mapper;

import com.uniorder.notificationservice.dto.response.NotificationResponse;
import com.uniorder.notificationservice.entity.NotificationEntity;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(NotificationEntity entity) {
        if (entity == null) return null;

        return NotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getContent())
                .type(entity.getType())
                .isRead(entity.isRead())
                .metadata(entity.getMetadata())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
