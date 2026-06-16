package com.uniorder.services.user.controller;

import com.uniorder.services.user.dto.request.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import com.uniorder.services.user.dto.response.AuthResponse;
import com.uniorder.services.user.service.impl.AuthServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register (
            @Valid @RequestBody RegisterRequest registerRequest
    ) {
        authService.register(registerRequest);
        return ResponseEntity.ok("Register Success. Please check your email to verify your account.");
    }

    // New endpoint for merchant registration
    @PostMapping("/register/merchant")
    public ResponseEntity<String> registerMerchant(
            @Valid @RequestBody RegisterMerchantRequest registerRequest
    ) {
        authService.registerMerchant(registerRequest);
        return ResponseEntity.ok("Merchant registration success. Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @GetMapping("/verify")
    public void verify (
            @RequestParam("token") String token,
            HttpServletResponse response
    ) throws IOException {
        try {
            String message = authService.verifyUser(token);

            response.sendRedirect("http://localhost:5173/verify-success");
        } catch (Exception e) {
            response.sendRedirect("http://localhost:5173/verify-fail?error=" + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword (
            @RequestBody ForgotPasswordRequest forgotPasswordRequest
    ) {
        authService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("Please check your email to reset your password.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword (
            @RequestBody ResetPasswordRequest resetPasswordRequest
    ) {
        authService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Your password has been reset. You can login now!");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        // request chỉ chứa idToken và appSource="CUSTOMER"
        return ResponseEntity.ok(authService.loginWithGoogle(request));
    }
}
