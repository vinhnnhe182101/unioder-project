CREATE TABLE platforms (
                           platform_id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(100) UNIQUE NOT NULL, -- FACEBOOK, GRABFOOD, SHOPEEFOOD, ZALO
                           api_base_url TEXT,
                           is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE platform_connections (
                                      connection_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      rest_id BIGINT NOT NULL, -- ID nhà hàng gốc trong UniOrder
                                      platform_id INT NOT NULL,

                                      status ENUM('CONNECTED', 'DISCONNECTED', 'ERROR') NOT NULL DEFAULT 'DISCONNECTED',

    -- Token xác thực
                                      access_token TEXT,
                                      refresh_token TEXT,
                                      token_expires_at TIMESTAMP NULL,

    -- Webhook verify (đặc thù Facebook/Zalo)
                                      webhook_secret VARCHAR(255),

    -- Cấu hình chung (JSON)
    -- VD: {"auto_reply": true, "sync_price": true}
                                      config JSON,

                                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                      FOREIGN KEY (platform_id) REFERENCES platforms(platform_id)
);

CREATE TABLE platform_stores (
                                 store_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 connection_id BIGINT NOT NULL,

    -- ID định danh trên sàn (VD: Page ID Facebook, Merchant ID Grab)
                                 external_store_id VARCHAR(255) NOT NULL,
                                 store_name VARCHAR(255),

    -- Trạng thái riêng của từng cửa hàng con
                                 is_active BOOLEAN DEFAULT TRUE,

    -- Metadata riêng (JSON)
    -- VD: {"page_url": "...", "rating": 4.5}
                                 metadata JSON,

                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 FOREIGN KEY (connection_id) REFERENCES platform_connections(connection_id) ON DELETE CASCADE,
                                 UNIQUE KEY uk_external_store (connection_id, external_store_id)
);

CREATE TABLE product_mappings (
                                  mapping_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Link nội bộ
                                  internal_product_id BIGINT NOT NULL, -- ID trong Catalog Service

    -- Link ngoại bộ
                                  platform_store_id BIGINT NOT NULL, -- Link tới cửa hàng sàn nào
                                  external_product_id VARCHAR(255) NOT NULL, -- ID món trên sàn

    -- Trạng thái đồng bộ
                                  sync_status ENUM('SYNCED', 'PENDING', 'FAILED') DEFAULT 'SYNCED',
                                  last_sync_at TIMESTAMP NULL,

                                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  FOREIGN KEY (platform_store_id) REFERENCES platform_stores(store_id) ON DELETE CASCADE,
                                  UNIQUE KEY uk_product_mapping (internal_product_id, platform_store_id)
);