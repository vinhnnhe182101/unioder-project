package org.example.services.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UserProfileDTO {
    private Long userId;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String phoneNumber;
    private List<String> roles;
}