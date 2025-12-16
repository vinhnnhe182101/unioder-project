import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Popover, List, Badge, Switch } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    ArrowRightOutlined,
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Context
    const { logout, user, currentRestaurant } = useAuth();
    const { notifications, unreadCount, markAsRead } = useNotification();
    const { isDarkMode, toggleTheme } = useTheme();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // [LOGIC MỚI] Kiểm tra xem có cần ẩn Sidebar không
    // Các trang không cần sidebar: Chọn nhà hàng, Tạo nhà hàng
    const isFullWidthPage = ['/select-restaurant', '/onboarding'].includes(location.pathname);

    // Logic chặn click menu nếu chưa chọn nhà hàng
    const handleMenuClick = ({ key }) => {
        // Nếu user cố tình click menu (trong trường hợp sidebar vẫn hiện) mà chưa có nhà hàng
        if (!currentRestaurant && !['/select-restaurant', '/onboarding'].includes(key)) {
            // Chuyển hướng về trang chọn
            navigate('/select-restaurant');
            return;
        }
        navigate(key);
    };

    const handleLogout = () => logout();

    const userMenu = [
        { key: 'profile', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
        { key: 'settings', label: 'Cài đặt', icon: <SettingOutlined /> },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
    ];

    const menuItems = [
        { key: '/', icon: <DashboardOutlined />, label: 'Dashboard', disabled: !currentRestaurant },
        { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Quản lý Đơn hàng', disabled: !currentRestaurant },
        {
            key: '/catalog',
            icon: <AppstoreOutlined />,
            label: 'Quản lý Menu',
            disabled: !currentRestaurant, // Disable cả cụm nếu chưa chọn
            children: [
                { key: '/catalog/categories', label: 'Danh mục' },
                { key: '/catalog/products', label: 'Món ăn' },
                { key: '/catalog/options', label: 'Topping/Option' },
            ],
        },
    ];

    const notificationContent = (
        <div style={{ width: 320 }}>
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={notifications.slice(0, 5)}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                background: item.isRead ? 'transparent' : (isDarkMode ? '#1f1f1f' : '#e6f7ff'),
                                cursor: 'pointer',
                                padding: '12px 16px',
                                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
                            }}
                            onClick={() => markAsRead(item.id)}
                        >
                            <List.Item.Meta
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: item.isRead ? 'normal' : 'bold', fontSize: 13 }}>{item.title}</span>
                                        {!item.isRead && <Badge status="processing" />}
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ fontSize: 12, color: isDarkMode ? '#aaa' : '#666' }}>{item.message}</div>
                                        <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                                            {dayjs(item.createdAt).fromNow()}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                {notifications.length === 0 && (
                    <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                        Không có thông báo mới
                    </div>
                )}
            </div>

            <div style={{ padding: '8px 0', borderTop: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0', textAlign: 'center' }}>
                <Button type="link" size="small" onClick={() => navigate('/notifications')}>
                    Xem tất cả thông báo <ArrowRightOutlined />
                </Button>
            </div>
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* [LOGIC MỚI] Chỉ hiện Sider nếu KHÔNG PHẢI là trang full width */}
            {!isFullWidthPage && (
                <Sider trigger={null} collapsible collapsed={collapsed} theme={isDarkMode ? 'dark' : 'light'} width={240} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10 }}>
                    <div className="demo-logo-vertical" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}>
                        <h2 style={{ color: '#1890ff', margin: 0, fontSize: collapsed ? 18 : 24, transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {collapsed ? 'UO' : 'UniOrder'}
                        </h2>
                    </div>
                    <Menu
                        theme={isDarkMode ? 'dark' : 'light'}
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        // Mở submenu cha nếu đang ở menu con
                        defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{ borderRight: 0, marginTop: 8 }}
                    />
                </Sider>
            )}

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, boxShadow: '0 1px 4px rgba(0,21,41,0.08)', zIndex: 9 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* [LOGIC MỚI] Ẩn nút toggle sidebar nếu không có sidebar */}
                        {!isFullWidthPage && (
                            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px', width: 64, height: 64 }} />
                        )}
                        {/* Hiện logo UniOrder ở Header nếu ẩn Sidebar đi cho đỡ trống */}
                        {isFullWidthPage && (
                            <h2 style={{ color: '#1890ff', margin: '0 0 0 24px', fontSize: 24 }}>UniOrder</h2>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        {/* Hiện tên nhà hàng đang chọn */}
                        {currentRestaurant && (
                            <div style={{ fontWeight: 600, fontSize: 16, color: '#1890ff' }}>
                                {currentRestaurant.name}
                            </div>
                        )}

                        {/* Nút chuyển Theme */}
                        <Switch
                            checkedChildren={<BulbFilled />}
                            unCheckedChildren={<BulbOutlined />}
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />

                        {/* Chuông thông báo */}
                        <Popover
                            content={notificationContent}
                            title="Thông báo mới nhất"
                            trigger="click"
                            placement="bottomRight"
                            overlayInnerStyle={{ padding: 0 }}
                        >
                            <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                                <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 20 }} />} />
                            </Badge>
                        </Popover>

                        {/* User Avatar */}
                        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} src={user?.avatarUrl} />
                                <span style={{ fontWeight: 500 }}>{user?.fullName || 'Admin'}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content style={{ margin: '24px 16px 0' }}>
                    {/* Style riêng cho trang chọn nhà hàng để nó căn giữa đẹp hơn nếu cần */}
                    <div style={{
                        padding: 24,
                        minHeight: 360,
                        background: isFullWidthPage ? 'transparent' : colorBgContainer,
                        borderRadius: borderRadiusLG
                    }}>
                        <Outlet />
                    </div>
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>UniOrder ©2025 Created by HungBH</div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;