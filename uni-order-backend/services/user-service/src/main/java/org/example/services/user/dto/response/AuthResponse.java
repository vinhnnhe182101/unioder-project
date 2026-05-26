package org.example.services.user.dto.response;

import lombok.*;
import org.example.services.user.dto.UserProfileDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserProfileDTO user;
}
