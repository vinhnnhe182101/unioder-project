-- Sửa bảng categories
ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP NULL;

-- Sửa bảng products (Nếu thiếu)
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP NULL;

-- Sửa bảng product_options (Nếu thiếu)
ALTER TABLE product_options ADD COLUMN deleted_at TIMESTAMP NULL;

