package com.example.notificationservice.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRequest {
    private Long restaurantId; // Gửi đến quán nào
    private String title;
    private String message;
    private String type;
}
