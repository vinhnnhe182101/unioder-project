package com.uniorder.services.user.service;

import com.uniorder.services.user.dto.request.*;
import com.uniorder.services.user.dto.response.AuthResponse;

public interface AuthService {

    void register(RegisterRequest request);

    // Register merchant account linked to a restaurant and a merchant role
    void registerMerchant(RegisterMerchantRequest request);

    AuthResponse login(LoginRequest request);

    String verifyUser(String token);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse loginWithGoogle(GoogleLoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);
}
