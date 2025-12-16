-- Tạo bảng đơn hàng
CREATE TABLE orders (
                        order_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Thông tin định danh
                        rest_id BIGINT NOT NULL, -- ID nhà hàng (quan trọng nhất)
                        customer_id BIGINT, -- Link tới CRM Service (nếu khách quen)
                        platform_connection_id BIGINT, -- Link tới Integration Service (nếu đơn từ Grab/Shopee)

    -- Mã đơn hàng (VD: #1001, #GRAB-X829)
                        order_number VARCHAR(50) NOT NULL,

    -- Trạng thái đơn hàng
                        status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING',
                        cancel_reason VARCHAR(255), -- [MỚI] Lưu lý do hủy (Hết món, Khách bom...)

    -- Loại đơn
                        order_type ENUM('DINE_IN', 'DELIVERY', 'PICKUP') NOT NULL DEFAULT 'DINE_IN',

    -- Tài chính (Dùng DECIMAL cho tiền tệ là bắt buộc)
                        subtotal_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        shipping_fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
                        total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,

    -- Thông tin giao hàng & Khách hàng (Snapshot)
                        shipping_address JSON, -- { "address": "...", "lat": ..., "long": ... }

    -- [MỚI] Thông tin người nhận (Tên, SĐT người nhận - có thể khác người đặt)
                        delivery_info JSON,

                        customer_snapshot JSON, -- { "name": "...", "phone": "..." } - Thông tin người đặt (Account)

    -- Ghi chú chung cho đơn hàng
                        note TEXT,

    -- Hẹn giờ (Pre-order)
                        scheduled_for TIMESTAMP NULL,

    -- Trạng thái in ấn (Cho Automation)
                        print_status ENUM('PENDING', 'PRINTED', 'FAILED') DEFAULT 'PENDING',

    -- Audit
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Index để tìm kiếm nhanh
                        INDEX idx_rest_id (rest_id),
                        INDEX idx_order_number (order_number),
                        INDEX idx_created_at (created_at),

    -- Đảm bảo mã đơn hàng là duy nhất trong phạm vi 1 nhà hàng (hoặc toàn hệ thống tùy logic)
                        UNIQUE KEY uk_order_number_rest (rest_id, order_number)
);

-- Tạo bảng chi tiết món ăn (Order Items)
CREATE TABLE order_items (
                             order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             order_id BIGINT NOT NULL,

    -- Link sang Catalog (để report món bán chạy)
                             product_id BIGINT,

    -- Snapshot dữ liệu tại thời điểm đặt (Quan trọng: Giá/Tên có thể đổi sau này)
                             product_name VARCHAR(255) NOT NULL,
                             product_image VARCHAR(500),
                             unit_price DECIMAL(15, 2) NOT NULL, -- Giá gốc 1 món

                             quantity INT NOT NULL CHECK (quantity > 0),

    -- Tổng tiền dòng này = (unit_price + options_price) * quantity
                             total_price DECIMAL(15, 2) NOT NULL,

    -- Lưu options đã chọn dưới dạng JSON để đơn giản hóa việc đọc/ghi (cho frontend hiển thị nhanh)
    -- VD: [{"name": "Mức đường", "value": "50%", "price": 0}, {"name": "Topping", "value": "Trân châu", "price": 5000}]
                             selected_options JSON,

                             note TEXT, -- Ghi chú riêng cho món (vd: Không hành)

                             FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- [MỚI] Bảng lưu chi tiết các option đã chọn (Normalization)
-- Bảng này giúp việc query thống kê topping bán chạy dễ dàng hơn là parse JSON
CREATE TABLE order_item_options (
                                    order_item_option_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    order_item_id BIGINT NOT NULL,

                                    option_group_name VARCHAR(100) NOT NULL, -- VD: Mức đá, Topping
                                    option_item_name VARCHAR(100) NOT NULL, -- VD: 50%, Trân châu trắng
                                    extra_price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,

                                    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE
);

-- Lịch sử thay đổi trạng thái (Audit Log cho đơn hàng)
CREATE TABLE order_status_history (
                                      history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      order_id BIGINT NOT NULL,

                                      previous_status VARCHAR(50),
                                      new_status VARCHAR(50) NOT NULL,

                                      changed_by_user_id BIGINT, -- Null nếu do hệ thống tự đổi (Automation)
                                      reason VARCHAR(255),

                                      changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Ghi chú nội bộ (Của nhân viên với nhau)
CREATE TABLE order_notes (
                             note_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             user_id BIGINT,
                             content TEXT NOT NULL,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Thanh toán
CREATE TABLE payments (
                          payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          order_id BIGINT NOT NULL,

                          amount DECIMAL(15, 2) NOT NULL,

                          method ENUM('COD', 'CREDIT_CARD', 'BANK_TRANSFER', 'E_WALLET', 'QR_CODE') NOT NULL,

    -- Gateway info
                          gateway_provider VARCHAR(50), -- 'MOMO', 'VNPAY', 'STRIPE'
                          gateway_transaction_id VARCHAR(255),

                          status ENUM('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',

                          paid_at TIMESTAMP NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);