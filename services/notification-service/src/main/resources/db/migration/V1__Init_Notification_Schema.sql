CREATE TABLE notifications (
                               notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Định danh người nhận (Có thể là User cụ thể HOẶC cả Nhà hàng)
                               recipient_user_id BIGINT, -- Nullable (nếu gửi cho cả quán)
                               restaurant_id BIGINT,     -- Nullable (nếu gửi riêng cho system admin)

    -- Phân loại
                               channel ENUM('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'WEB_SOCKET') NOT NULL DEFAULT 'WEB_SOCKET',
                               type VARCHAR(50) NOT NULL, -- VD: ORDER_CREATED, PAYMENT_SUCCESS, SYSTEM_ALERT

    -- Nội dung
                               title VARCHAR(255),
                               content TEXT NOT NULL,
                               metadata JSON, -- e.g. {"orderId": 101, "redirectUrl": "/orders/101"}

    -- Trạng thái
                               status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
                               is_read BOOLEAN DEFAULT FALSE, -- Đã đọc hay chưa

    -- Lịch gửi (cho phép gửi sau)
                               scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               sent_at TIMESTAMP NULL,

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Index để query nhanh danh sách thông báo của user/nhà hàng
                               INDEX idx_recipient (recipient_user_id),
                               INDEX idx_restaurant (restaurant_id),
                               INDEX idx_created_at (created_at)
);