import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Popover, List, Badge, Switch, message, Typography } from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, AppstoreOutlined,
    ShoppingCartOutlined, UserOutlined, LogoutOutlined, SettingOutlined,
    BellOutlined, ArrowRightOutlined, BulbOutlined, BulbFilled, ShopOutlined,
    SwapOutlined, TeamOutlined
} from '@ant-design/icons';
// Đảm bảo các đường dẫn này khớp với cấu trúc thư mục của bạn
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Kích hoạt plugin thời gian tương đối cho dayjs
dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy dữ liệu từ Context
    const { logout, user, currentRestaurant } = useAuth();
    const { notifications = [], unreadCount = 0, markAsRead } = useNotification();
    const { isDarkMode, toggleTheme } = useTheme();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Kiểm tra xem có đang ở trang chọn nhà hàng không
    const isFullWidthPage = ['/select-restaurant', '/onboarding'].includes(location.pathname);

    const handleMenuClick = ({ key }) => {
        if (key === 'switch-restaurant') {
            navigate('/select-restaurant');
            return;
        }

        // Nếu chưa chọn nhà hàng thì yêu cầu chọn trước khi vào các mục khác
        if (!currentRestaurant && !isFullWidthPage) {
            message.warning("Vui lòng chọn hoặc tạo nhà hàng để tiếp tục!");
            navigate('/select-restaurant');
            return;
        }
        navigate(key);
    };

    const handleLogout = () => logout();

    // Menu cho dropdown User ở góc phải
    const userMenuItems = [
        {
            key: 'profile',
            label: 'Hồ sơ cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile')
        },
        {
            key: 'switch',
            label: 'Đổi nhà hàng',
            icon: <SwapOutlined />,
            onClick: () => navigate('/select-restaurant')
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },
    ];

    // Cấu trúc Sidebar Menu - Đã đưa Setting vào đây
    const sidebarItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Bảng điều khiển',
            disabled: !currentRestaurant
        },
        {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Quản lý Đơn hàng',
            disabled: !currentRestaurant
        },
        {
            key: '/catalog',
            icon: <AppstoreOutlined />,
            label: 'Quản lý Thực đơn',
            disabled: !currentRestaurant,
            children: [
                { key: '/catalog/categories', label: 'Danh mục món' },
                { key: '/catalog/products', label: 'Món ăn' },
                { key: '/catalog/options', label: 'Tùy chọn thêm' },
            ],
        },
        {
            key: '/staff',
            icon: <TeamOutlined />,
            label: 'Nhân viên',
            disabled: !currentRestaurant
        },
        // [CẬP NHẬT] Đưa Setting vào Sidebar vì User quản lý nhiều nhà hàng
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt Nhà hàng',
            disabled: !currentRestaurant
        },
        { type: 'divider' },
        {
            key: 'switch-restaurant',
            icon: <SwapOutlined />,
            label: 'Chuyển đổi nhà hàng'
        },


    ];

    // Nội dung hiển thị thông báo
    const notificationList = (
        <div style={{ width: 320 }}>
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={notifications.slice(0, 5)}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                background: item.isRead ? 'transparent' : (isDarkMode ? '#1f1f1f' : '#e6f7ff'),
                                cursor: 'pointer', padding: '12px 16px', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
                            }}
                            onClick={() => markAsRead(item.id)}
                        >
                            <List.Item.Meta
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong={!item.isRead} style={{ fontSize: 13 }}>{item.title}</Text>
                                        {!item.isRead && <Badge status="processing" />}
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ fontSize: 12, color: isDarkMode ? '#aaa' : '#666' }}>{item.message}</div>
                                        <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{dayjs(item.createdAt).fromNow()}</div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                {notifications.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>Không có thông báo mới</div>}
            </div>
            <div style={{ padding: '8px 0', borderTop: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0', textAlign: 'center' }}>
                <Button type="link" size="small" onClick={() => navigate('/notifications')}>Xem tất cả thông báo <ArrowRightOutlined /></Button>
            </div>
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {!isFullWidthPage && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme={isDarkMode ? 'dark' : 'light'}
                    width={240}
                    style={{
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        position: 'fixed',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        overflow: 'auto'
                    }}
                >
                    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}>
                        <ShopOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: collapsed ? 0 : 8 }} />
                        {!collapsed && <Text strong style={{ color: '#1890ff', fontSize: 20 }}>UniOrder</Text>}
                    </div>
                    <Menu
                        theme={isDarkMode ? 'dark' : 'light'}
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={sidebarItems}
                        onClick={handleMenuClick}
                        style={{ borderRight: 0, marginTop: 8 }}
                    />
                </Sider>
            )}

            <Layout style={{ marginLeft: !isFullWidthPage ? (collapsed ? 80 : 240) : 0, transition: 'margin-left 0.2s' }}>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
                    zIndex: 9,
                    position: 'sticky',
                    top: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {!isFullWidthPage && (
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '16px', width: 40, height: 40, marginRight: 16 }}
                            />
                        )}
                        {currentRestaurant && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar shape="square" src={currentRestaurant.logoUrl} icon={<ShopOutlined />} />
                                <div style={{ lineHeight: 1 }}>
                                    <Text strong style={{ fontSize: 16, display: 'block' }}>{currentRestaurant.name}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>ID: #{currentRestaurant.restId}</Text>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Switch
                            checkedChildren={<BulbFilled />}
                            unCheckedChildren={<BulbOutlined />}
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />

                        <Popover content={notificationList} title="Thông báo" trigger="click" placement="bottomRight" overlayInnerStyle={{ padding: 0 }}>
                            <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                                <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 20 }} />} />
                            </Badge>
                        </Popover>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} src={user?.avatarUrl} />
                                <Text strong>{user?.fullName || 'Người dùng'}</Text>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{
                        padding: 24,
                        minHeight: 'calc(100vh - 170px)',
                        background: isFullWidthPage ? 'transparent' : colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: isFullWidthPage ? 'none' : '0 1px 3px rgba(0,0,0,0.02)'
                    }}>
                        <Outlet />
                    </div>
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>UniOrder System ©2025 Created by HungBH</div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;