package com.uniorder.services.user.dto;

import lombok.Data;

@Data
public class UpdateProfileDTO {
    private String fullName;
    private String avatarUrl;
    private String phoneNumber;
}
