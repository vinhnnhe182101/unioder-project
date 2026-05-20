CREATE TABLE users (
                       user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       full_name VARCHAR(255) NOT NULL,
                       phone_number VARCHAR(20) UNIQUE,
                       avatar_url TEXT,
                       status ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED') NOT NULL DEFAULT 'PENDING_VERIFICATION',
                       email_verified_at TIMESTAMP NULL,
                       email_verification_token VARCHAR(255),
                       password_reset_token VARCHAR(255),

                       password_reset_expires_at TIMESTAMP NULL,
                       last_login TIMESTAMP NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       deleted_at TIMESTAMP NULL
);

CREATE TABLE roles (
                       role_id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'Owner', 'Manager', 'Staff'
                       description TEXT,
                       is_system_role BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE permissions (
                             permission_id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(100) UNIQUE NOT NULL -- e.g., 'orders:create', 'menu:update'
);

CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL,
                            role_id INT NOT NULL,
                            restaurant_id BIGINT NOT NULL, -- ID nhà hàng (phạm vi) mà user có vai trò
                            PRIMARY KEY (user_id, role_id, restaurant_id),
                            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                            FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE role_permissions (
                                  role_id INT NOT NULL,
                                  permission_id INT NOT NULL,
                                  PRIMARY KEY (role_id, permission_id),
                                  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
                                  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);