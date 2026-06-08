package com.uniorder.services.user.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDTO {
    private Long userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
    private String roleName; // ROLE_MANAGER, ROLE_CHEF, ROLE_WAITER
    private LocalDateTime createdAt;
}
