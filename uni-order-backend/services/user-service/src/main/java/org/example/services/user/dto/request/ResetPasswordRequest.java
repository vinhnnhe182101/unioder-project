package org.example.services.user.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    String token;
    String newPassword;
}
