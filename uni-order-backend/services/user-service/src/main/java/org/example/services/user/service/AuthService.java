package org.example.services.user.service;

import org.example.auth.*;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    String verifyUser(String token);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse refreshToken(String email);
}
