package org.example.services.user.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, length = 20)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserStatus status = UserStatus.PENDING_VERIFICATION;

    private LocalDateTime emailVerifiedAt;

    private String emailVerificationToken;

    private String passwordResetToken;

    private LocalDateTime passwordResetExpiresAt;

    private LocalDateTime lastLogin;

    @CreationTimestamp // Tự động gán thời gian khi tạo mới
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Tự động gán thời gian khi cập nhật
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = false
    )
    private Set<UserRoleEntity> userRoles = new HashSet<>();

    public enum UserStatus {
        PENDING_VERIFICATION,
        ACTIVE,
        SUSPENDED,
        DEACTIVATED
    }

    @Column(nullable = false)
    private boolean enabled = false;

    private String verificationToken;

    private LocalDateTime tokenExpirationTime;

    private String resetPasswordToken;

    private LocalDateTime resetPasswordTokenExpiry;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    public enum AuthProvider {
        LOCAL,
        GOOGLE,
        FACEBOOK
    }

    public void addUserRole(UserRoleEntity ur) {
        userRoles.add(ur);
        ur.setUser(this);
    }

    public void removeUserRole(UserRoleEntity ur) {
        userRoles.remove(ur);
        ur.setUser(null);
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserAddressesEntity> address = new ArrayList<>();
}
