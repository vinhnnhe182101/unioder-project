package com.uniorder.services.user.dto.response;

import lombok.*;
import com.uniorder.services.user.dto.UserProfileDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserProfileDTO user;
}
