-- 1. Insert Permissions (Quyền hạn chi tiết)
INSERT INTO permissions (name) VALUES
                                   ('system:access'),          -- Truy cập hệ thống admin
                                   ('restaurant:manage'),      -- Quản lý thông tin nhà hàng
                                   ('menu:view'),              -- Xem menu
                                   ('menu:edit'),              -- Sửa menu
                                   ('order:create'),           -- Tạo đơn
                                   ('order:process'),          -- Xử lý đơn (Bếp)
                                   ('order:payment'),          -- Thanh toán
                                   ('report:view'),            -- Xem báo cáo
                                   ('staff:manage');           -- Quản lý nhân viên

-- 2. Insert Roles
INSERT INTO roles (name, description, is_system_role) VALUES
                                                          ('ROLE_OWNER', 'Restaurant Owner', FALSE),
                                                          ('ROLE_MANAGER', 'Restaurant Manager', FALSE),
                                                          ('ROLE_CHEF', 'Kitchen Staff', FALSE),
                                                          ('ROLE_WAITER', 'Service Staff', FALSE);

-- 3. Map Role - Permission (Gán quyền cho Role)
-- (Giả sử ID tự tăng lần lượt từ 1..N, trong thực tế nên query ID để an toàn hơn)

-- ADMIN: Full quyền hệ thống
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p WHERE r.name = 'ROLE_ADMIN';

-- OWNER: Full quyền nhà hàng
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.name = 'ROLE_OWNER' AND p.name IN ('restaurant:manage', 'menu:view', 'menu:edit', 'order:create', 'order:process', 'order:payment', 'report:view', 'staff:manage');

-- MANAGER: Giống Owner nhưng trừ staff:manage cao cấp
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER' AND p.name IN ('restaurant:manage', 'menu:view', 'menu:edit', 'order:create', 'order:process', 'order:payment', 'report:view');

-- CHEF: Chỉ quan tâm Order Process và Menu View
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.name = 'ROLE_CHEF' AND p.name IN ('menu:view', 'order:process');

-- WAITER: Tạo đơn, thanh toán
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM roles r, permissions p
WHERE r.name = 'ROLE_WAITER' AND p.name IN ('menu:view', 'order:create', 'order:payment');