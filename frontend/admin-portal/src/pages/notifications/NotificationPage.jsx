import { useState } from 'react';
import { List, Card, Button, Tag, Typography, Avatar, Space, Pagination, message } from 'antd';
import { BellOutlined, CheckOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text } = Typography;

const NotificationPage = () => {
    const queryClient = useQueryClient();
    const { user, currentRestaurant } = useAuth();
    const navigate = useNavigate(); // Hook chuyển trang

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Fetch notifications
    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ['notifications', currentPage],
        queryFn: () => notificationService.getMyNotifications({
            restId: currentRestaurant?.restId,
            userId: user?.userId,
            page: currentPage - 1,
            size: pageSize
        }),
        enabled: !!currentRestaurant && !!user,
    });


    // Mark as read mutation
    const markReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationService.markAllAsRead({
            restId: currentRestaurant?.restId,
            userId: user?.userId
        }),
        onSuccess: () => {
            message.success("Đã đánh dấu tất cả là đã đọc");
            queryClient.invalidateQueries(['notifications']);
        }
    });

    const handleItemClick = (item) => {
        if (!item.isRead) {
            markReadMutation.mutate(item.id);
        }

        if (item.metadata) {
            try {
                const meta = JSON.parse(item.metadata);
                if (meta.orderId) {
                    navigate(`/orders`);
                }
            } catch (e) {
                console.error("Error parsing metadata", e);
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Card
            title={<span><BellOutlined /> Trung tâm Thông báo</span>}
            extra={
                <Button
                    type="link"
                    icon={<CheckCircleOutlined />}
                    onClick={() => markAllReadMutation.mutate()}
                    loading={markAllReadMutation.isPending}
                >
                    Đánh dấu tất cả đã đọc
                </Button>
            }
        >
            <List
                itemLayout="horizontal"
                loading={isLoading}
                dataSource={notificationsData?.content || []}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            !item.isRead && (
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Tránh trigger click vào row
                                        markReadMutation.mutate(item.id);
                                    }}
                                >
                                    Đã xem
                                </Button>
                            )
                        ]}
                        // Thêm style cursor pointer và sự kiện click
                        style={{
                            background: item.isRead ? 'transparent' : '#f0f5ff',
                            transition: 'all 0.3s',
                            padding: '12px 24px',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleItemClick(item)}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={<BellOutlined />}
                                    style={{ backgroundColor: item.type === 'ORDER_CREATED' ? '#52c41a' : '#1890ff' }}
                                />
                            }
                            title={
                                <Space>
                                    <Text strong={!item.isRead}>{item.title}</Text>
                                    {item.type === 'ORDER_CREATED' && <Tag color="green">Đơn mới</Tag>}
                                </Space>
                            }
                            description={
                                <div>
                                    <div style={{ marginBottom: 4 }}>{item.message}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        <ClockCircleOutlined /> {dayjs(item.createdAt).fromNow()}
                                    </Text>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />

            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={notificationsData?.totalElements || 0}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </Card>
    );
};

export default NotificationPage;