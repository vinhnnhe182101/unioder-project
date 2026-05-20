package org.example.services.user.service.impl;

import jakarta.transaction.Transactional;
import org.example.auth.*;
import org.example.services.user.entity.RoleEntity;
import org.example.services.user.entity.UserEntity;
import org.example.services.user.entity.UserRoleEntity;
import org.example.services.user.exception.InvalidCredentialsException;
import org.example.services.user.exception.VerificationException;
import org.example.services.user.repository.RoleRepository;
import org.example.services.user.repository.UserRepository;
import org.example.services.user.repository.UserRoleRepository;
import org.example.services.user.security.JwtService;
import org.example.services.user.service.AuthService;
import org.example.services.user.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

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
        String token = jwtService.generateToken(userEntity);

        return new AuthResponse(token);
    }

    public AuthResponse refreshToken(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newToken = jwtService.generateToken(user);

        return new AuthResponse(newToken);
    }
}
