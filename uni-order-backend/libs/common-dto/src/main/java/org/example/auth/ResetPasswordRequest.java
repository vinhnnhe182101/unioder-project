package org.example.auth;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    String token;
    String newPassword;
}
