package com.example.integrationservice.controller;

import com.example.integrationservice.service.FacebookService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integration/facebook/webhook")
public class FacebookWebhookController {

    @Value("${facebook.webhook.verify-token}")
    private String verifyToken;

    private FacebookService facebookService;

    public FacebookWebhookController(FacebookService facebookService) {
        this.facebookService = facebookService;
    }

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge
    ) {
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {

            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> receiveEvent(@RequestBody String payload) {

        System.out.println(">>> RAW PAYLOAD: " + payload);

        facebookService.processWebhook(payload);

        return ResponseEntity.ok().build();
    }
}
