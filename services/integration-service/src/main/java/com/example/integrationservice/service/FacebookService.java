package com.example.integrationservice.service;

public interface FacebookService {

    void processWebhook(String payload);

    void handleOrderCommand(String pageId, String senderId, String text);
}
