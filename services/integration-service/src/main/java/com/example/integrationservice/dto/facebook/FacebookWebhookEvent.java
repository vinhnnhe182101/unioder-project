package com.example.integrationservice.dto.facebook;

import lombok.Data;

import java.util.List;

@Data
public class FacebookWebhookEvent {
    private String object;
    private List<Entry> entry;

    @Data
    public static class Entry {
        private String id;
        private Long time;
        private List<Messaging> messaging;
    }

    @Data
    public static class Messaging {
        private Sender sender;
        private Recipient recipient;
        private Long timestamp;
        private Message message;
    }

    @Data
    public static class Sender { private String id; }

    @Data
    public static class Recipient { private String id; }

    @Data
    public static class Message {
        private String mid;
        private String text;
    }
}
