INSERT INTO roles (name, description, is_system_role) VALUES ('ROLE_ADMIN', 'System Administrator', TRUE);
INSERT INTO roles (name, description, is_system_role) VALUES ('ROLE_CUSTOMER', 'Normal Customer', FALSE);

-- Tạo bảng lưu địa chỉ/định vị cho Customer (Một user có thể có nhiều địa chỉ giao hàng như KTX, Tòa Alpha...)
CREATE TABLE user_addresses (
                                address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                address_line TEXT NOT NULL,
                                latitude DECIMAL(10, 8), -- Vĩ độ
                                longitude DECIMAL(11, 8), -- Kinh độ
                                is_default BOOLEAN DEFAULT FALSE,
                                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
