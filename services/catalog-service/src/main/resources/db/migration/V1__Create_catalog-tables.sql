CREATE TABLE restaurants (
                             rest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             owner_id BIGINT NOT NULL,
                             name VARCHAR(255) NOT NULL,
                             address TEXT,
                             phone_number VARCHAR(20),
                             contact_email VARCHAR(255),
                             logo_url TEXT,
                             description TEXT,
                             latitude DECIMAL(10, 8),
                             longitude DECIMAL(11, 8),
                             timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
                             operating_hours JSON,
                             status ENUM('PENDING_APPROVAL', 'ACTIVE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED') NOT NULL DEFAULT 'PENDING_APPROVAL',
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             deleted_at TIMESTAMP NULL
);

CREATE TABLE categories (
                            category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            rest_id BIGINT NOT NULL,
                            name VARCHAR(100) NOT NULL,
                            description TEXT,
                            display_order INT DEFAULT 0,
                            is_active BOOLEAN DEFAULT TRUE,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (rest_id) REFERENCES restaurants(rest_id) ON DELETE CASCADE
);

CREATE TABLE products (
                          product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          rest_id BIGINT NOT NULL,
                          category_id BIGINT,
                          name VARCHAR(255) NOT NULL,
                          sku VARCHAR(100),
                          description TEXT,
                          img_url TEXT,
                          price DECIMAL(15, 2) NOT NULL,
                          is_available BOOLEAN NOT NULL DEFAULT TRUE, -- Còn hàng/Hết hàng
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (rest_id) REFERENCES restaurants(rest_id),
                          FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- [MỚI] Bảng Option Group (Ví dụ: "Mức đá", "Topping", "Độ chín")
CREATE TABLE product_options (
                                 option_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 product_id BIGINT NOT NULL,
                                 name VARCHAR(100) NOT NULL, -- Tên nhóm option
                                 is_multiple_choice BOOLEAN DEFAULT FALSE, -- False: Chọn 1 (Radio), True: Chọn nhiều (Checkbox)
                                 is_required BOOLEAN DEFAULT FALSE, -- Bắt buộc chọn hay không
                                 display_order INT DEFAULT 0,
                                 FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- [MỚI] Bảng Option Items (Ví dụ: "Ít đá", "Trân châu đen", "Chin vừa")
CREATE TABLE product_option_items (
                                      item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      option_id BIGINT NOT NULL,
                                      name VARCHAR(100) NOT NULL, -- Tên lựa chọn
                                      extra_price DECIMAL(15, 2) DEFAULT 0.00, -- Giá thêm (nếu có)
                                      is_available BOOLEAN DEFAULT TRUE,
                                      display_order INT DEFAULT 0,
                                      FOREIGN KEY (option_id) REFERENCES product_options(option_id) ON DELETE CASCADE
);

CREATE TABLE restaurant_configs (
                                    config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    rest_id BIGINT NOT NULL,
                                    config_key VARCHAR(100) NOT NULL,
                                    config_value TEXT,
                                    UNIQUE(rest_id, config_key),
                                    FOREIGN KEY (rest_id) REFERENCES restaurants(rest_id) ON DELETE CASCADE
);
