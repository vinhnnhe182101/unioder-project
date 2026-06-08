package com.uniorder.services.user.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.uniorder.services.user.dto.request.*;
import jakarta.transaction.Transactional;
import com.uniorder.services.user.dto.UserProfileDTO;
import com.uniorder.services.user.dto.request.*;
import com.uniorder.services.user.security.AccountDetails;
import org.springframework.beans.factory.annotation.Value;
import com.uniorder.services.user.dto.response.AuthResponse;
import com.uniorder.services.user.entity.RoleEntity;
import com.uniorder.services.user.entity.UserEntity;
import com.uniorder.services.user.entity.UserRoleEntity;
import com.uniorder.services.user.exception.InvalidCredentialsException;
import com.uniorder.services.user.exception.VerificationException;
import com.uniorder.services.user.repository.RoleRepository;
import com.uniorder.services.user.repository.UserRepository;
import com.uniorder.services.user.repository.UserRoleRepository;
import com.uniorder.services.user.security.JwtService;
import com.uniorder.services.user.service.AuthService;
import com.uniorder.services.user.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           RoleRepository roleRepository,
                           UserRoleRepository userRoleRepository,
                           AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    @Transactional
    @Override
    public void register(RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new VerificationException("Email already exists");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setFullName(registerRequest.getFullName());
        userEntity.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        userEntity.setProvider(UserEntity.AuthProvider.LOCAL);

        userEntity.setEnabled(false);
        String token = UUID.randomUUID().toString();
        userEntity.setVerificationToken(token);
        userEntity.setTokenExpirationTime(LocalDateTime.now().plusMinutes(15));

        UserEntity savedUserEntity = userRepository.save(userEntity);

        RoleEntity defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role Not Found"));

        Long platformRestaurantId = 0L;

        UserRoleEntity userRoleEntity = new UserRoleEntity(savedUserEntity, defaultRole, platformRestaurantId);

        userRoleRepository.save(userRoleEntity);

        emailService.sendVerificationEmail(savedUserEntity.getEmail(), token);
    }

    @Transactional
    public String verifyUser(String token) {

        UserEntity user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new VerificationException("Token Invalid"));

        if (user.getTokenExpirationTime().isBefore(LocalDateTime.now())) {
            throw new VerificationException("Token Expired");
        }

        user.setEnabled(true);
        user.setStatus(UserEntity.UserStatus.ACTIVE);
        user.setVerificationToken(null);
        user.setTokenExpirationTime(null);
        userRepository.save(user);

        return "Account Verified!";
    }

    @Transactional
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new VerificationException("Email Not Found"));

        String token = UUID.randomUUID().toString();
        userEntity.setResetPasswordToken(token);
        userEntity.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(userEntity);

        emailService.sendResetPasswordEmail(userEntity.getEmail(), token);
    }

    @Transactional
    @Override
    public void resetPassword(ResetPasswordRequest request) {
        UserEntity userEntity = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new VerificationException("Token Invalid"));

        if(userEntity.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new VerificationException("Token Expired");
        }

        userEntity.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userEntity.setResetPasswordToken(null);
        userEntity.setResetPasswordTokenExpiry(null);

        userRepository.save(userEntity);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        UserEntity  userEntity = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        List<String> roles = userEntity.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .collect(Collectors.toList());

        validateAppSourceAndRoles(loginRequest.getAppSource(), roles);

        return buildAuthResponse(userEntity, roles);
    }

    @Override
    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            // 1. Khởi tạo bộ xác minh token Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Verify token
            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token.");
            }

            // 3. Lấy thông tin từ Payload của Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // 4. Tìm user trong DB hoặc tạo mới nếu chưa có
            UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
                UserEntity newUser = new UserEntity();
                newUser.setEmail(email);
                newUser.setFullName(name != null ? name : "Google User");
                newUser.setAvatarUrl(pictureUrl);
                newUser.setProvider(UserEntity.AuthProvider.GOOGLE);
                newUser.setStatus(UserEntity.UserStatus.ACTIVE);
                newUser.setEnabled(true);

                UserEntity savedUser = userRepository.save(newUser);

                RoleEntity customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                        .orElseThrow(() -> new RuntimeException("Role ROLE_CUSTOMER not found in DB"));

                UserRoleEntity userRole = new UserRoleEntity(savedUser, customerRole, 0L);

                savedUser.addUserRole(userRole);

                return userRepository.save(newUser);
            });

            // Lấy roles
            List<String> roles = user.getUserRoles().stream()
                    .map(userRole -> userRole.getRole().getName())
                    .collect(Collectors.toList());

            // 5. KIỂM TRA QUYỀN
            validateAppSourceAndRoles(request.getAppSource(), roles);

            // 6. Tạo token và trả về
            return buildAuthResponse(user, roles);

        } catch (Exception e) {
            throw new RuntimeException("Google Login Failed: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        // 1. Trích xuất Email (Subject) từ chuỗi Refresh Token
        String email = jwtService.extractSubject(token);

        // 2. Tìm User trong cơ sở dữ liệu
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 3. Tạo đối tượng Spring Security UserDetails tạm thời để verify tính hợp lệ (Check hết hạn, check đúng chủ thể)
        AccountDetails userDetails = new AccountDetails(user);
        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new RuntimeException("Refresh token is invalid or expired. Please login again.");
        }

        // 4. Lấy lại danh sách Roles từ cấu trúc Entity bảng trung gian của bạn (để kẹp vào Access Token mới)
        List<String> roles = user.getUserRoles().stream()
                .map(userRoleEntity -> userRoleEntity.getRole().getName())
                .collect(Collectors.toList());

        // 5. Sinh cặp Access Token mới và Refresh Token mới (Sử dụng hàm buildAuthResponse đã tạo ở bước trước)
        return buildAuthResponse(user, roles);
    }

    private void validateAppSourceAndRoles(String appSource, List<String> roles) {
        if ("MERCHANT".equalsIgnoreCase(appSource)) {
            boolean hasMerchantRole = roles.stream().anyMatch(r ->
                    r.equals("ROLE_OWNER") || r.equals("ROLE_MANAGER") ||
                            r.equals("ROLE_CHEF") || r.equals("ROLE_WAITER"));
            if (!hasMerchantRole) {
                throw new RuntimeException("Tài khoản của bạn không có quyền truy cập hệ thống quản lý nhà hàng.");
            }
        } else if ("CUSTOMER".equalsIgnoreCase(appSource)) {
            if (!roles.contains("ROLE_CUSTOMER")) {
                throw new RuntimeException("Tài khoản không có quyền khách hàng.");
            }
        } else if ("SHIPPER".equalsIgnoreCase(appSource)) {
            if (!roles.contains("ROLE_SHIPPER")) {
                throw new RuntimeException("Tài khoản không có quyền giao hàng.");
            }
        } else {
            throw new RuntimeException("App Source không hợp lệ.");
        }
    }

    private AuthResponse buildAuthResponse(UserEntity user, List<String> roles) {
        // Tạo JWT Token (Kẹp roles vào payload trong JwtService)
        String accessToken = jwtService.generateToken(user, roles);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Map sang DTO
        UserProfileDTO userProfile = new UserProfileDTO();
        userProfile.setUserId(user.getUserId());
        userProfile.setEmail(user.getEmail());
        userProfile.setFullName(user.getFullName());
        userProfile.setAvatarUrl(user.getAvatarUrl());
        userProfile.setRoles(roles);

        return new AuthResponse(accessToken, refreshToken, userProfile);
    }
}
