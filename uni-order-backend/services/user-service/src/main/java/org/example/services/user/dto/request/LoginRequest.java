package org.example.services.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email can not blank!")
    @Email(message = "Wrong format email!")
    private String email;

    @NotBlank(message = "Password can not blank!")
    private String password;

    @NotBlank
    private String appSource;
}
