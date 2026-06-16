package com.uniorder.services.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterMerchantRequest {

    @NotBlank
    @Email(message = "Email can not blank!")
    private String email;

    @Size(min = 8, message = "Password at least 8 characters!")
    @NotBlank(message = "Password can not blank!")
    private String password;

    @NotBlank(message = "Full Name can not blank!")
    private String fullName;

    @NotNull(message = "restaurantId is required")
    private Long restaurantId;

    // Optional: role name to be assigned (eg. ROLE_OWNER). If null, default to ROLE_OWNER
    private String roleName;
}