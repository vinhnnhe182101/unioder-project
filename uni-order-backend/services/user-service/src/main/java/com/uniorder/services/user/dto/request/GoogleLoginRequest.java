package com.uniorder.services.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    @NotBlank(message = "Google ID Token is required")
    private String idToken;

    @NotBlank(message = "App Source is required")
    private String appSource;
}
