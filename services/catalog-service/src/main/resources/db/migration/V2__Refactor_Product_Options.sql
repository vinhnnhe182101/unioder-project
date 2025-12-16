-- 1. Sửa bảng product_options: Biến nó thành Global Option (thuộc về nhà hàng, không thuộc về product cụ thể)
ALTER TABLE product_options
DROP FOREIGN KEY product_options_ibfk_1; -- Tên constraint có thể khác tùy DB, bạn cần check

ALTER TABLE product_options
DROP COLUMN product_id;

ALTER TABLE product_options
    ADD COLUMN rest_id BIGINT NOT NULL;

ALTER TABLE product_options
    ADD CONSTRAINT fk_options_restaurant
        FOREIGN KEY (rest_id) REFERENCES restaurants(rest_id) ON DELETE CASCADE;

CREATE TABLE product_option_assignments (
                                            assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            product_id BIGINT NOT NULL,
                                            option_id BIGINT NOT NULL,
                                            display_order INT DEFAULT 0,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                                            FOREIGN KEY (option_id) REFERENCES product_options(option_id) ON DELETE CASCADE,

                                            UNIQUE(product_id, option_id) -- Một món chỉ gán 1 lần cho 1 option group
);