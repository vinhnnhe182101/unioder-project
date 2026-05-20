package org.example.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
public class RegisterRequest {

    @NotBlank
    @Email(message = "Email can not blank!")
    private String email;

    @Size(min = 8, message = "Password at least 8 characters!")
    @NotBlank(message = "Password can not blank!")
    private String password;

    @NotBlank(message = "Full Name can not blank!")
    private String fullName;
}
