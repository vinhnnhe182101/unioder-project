import { useState } from 'react';
import { Table, Card, Button, Space, Typography, Modal, Input, message, Tabs, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, FireOutlined, BellOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import dayjs from 'dayjs';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import PaymentModal from './components/PaymentModal.jsx';

const { Text } = Typography;

const OrderPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('ALL');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handlePaymentClick = (order) => {
        setSelectedOrder(order);
        setPaymentModalOpen(true);
    };

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getMyOrders,
        refetchInterval: 15000,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }) => orderService.updateStatus(orderId, status),
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công!');
            queryClient.invalidateQueries(['orders']);
        },
        onError: (err) => message.error('Lỗi: ' + err.message)
    });

    const cancelOrderMutation = useMutation({
        mutationFn: ({ orderId, reason }) => orderService.cancelOrder(orderId, reason),
        onSuccess: () => {
            message.success('Đã hủy đơn hàng');
            queryClient.invalidateQueries(['orders']);
        },
        onError: (err) => message.error('Lỗi: ' + err.message)
    });

    const handleStatusChange = (orderId, newStatus) => {
        updateStatusMutation.mutate({ orderId, status: newStatus });
    };

    const handleCancel = (orderId) => {
        // Trong thực tế nên dùng Modal của Antd, đây dùng tạm window.prompt cho nhanh
        const reason = window.prompt("Nhập lý do hủy:", "Khách đổi ý");
        if (reason) {
            cancelOrderMutation.mutate({ orderId, reason });
        }
    };

    const filteredOrders = orders?.filter(order => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return order.status === 'PENDING';
        if (activeTab === 'KITCHEN') return ['CONFIRMED', 'PREPARING'].includes(order.status);
        if (activeTab === 'READY') return order.status === 'READY_FOR_PICKUP';
        if (activeTab === 'HISTORY') return ['COMPLETED', 'CANCELLED'].includes(order.status);
        return true;
    });

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: text => <b>{text}</b>,
            width: 100,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => (
                <div>
                    <div>{dayjs(date).format('HH:mm')}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{dayjs(date).format('DD/MM')}</div>
                </div>
            ),
            width: 100,
        },
        {
            title: 'Khách hàng', // (Nếu có thông tin khách, tạm thời chưa hiển thị chi tiết)
            key: 'customer',
            render: (_, record) => <span>Khách lẻ</span>
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: amount => <Text strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => <OrderStatusBadge status={status} />
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 250,
            render: (_, record) => {
                const s = record.status;
                return (
                    <Space wrap>
                        {/* Nút Xem Chi tiết (Luôn hiện) */}
                        <Button icon={<EyeOutlined />} size="small" onClick={() => message.info("Tính năng xem chi tiết đang phát triển")}>Xem</Button>

                        {/* Logic hiển thị nút theo trạng thái */}

                        {/* PENDING: Xác nhận hoặc Hủy */}
                        {s === 'PENDING' && (
                            <>
                                <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleStatusChange(record.orderId, 'CONFIRMED')}>
                                    Nhận đơn
                                </Button>
                                <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleCancel(record.orderId)}>
                                    Hủy
                                </Button>
                            </>
                        )}

                        {/* CONFIRMED: Chuyển xuống bếp nấu */}
                        {s === 'CONFIRMED' && (
                            <Button type="primary" ghost size="small" icon={<FireOutlined />} onClick={() => handleStatusChange(record.orderId, 'PREPARING')}>
                                Báo Bếp Nấu
                            </Button>
                        )}

                        {/* PREPARING: Bếp báo xong */}
                        {s === 'PREPARING' && (
                            <Button type="primary" style={{background: '#722ed1'}} size="small" icon={<BellOutlined />} onClick={() => handleStatusChange(record.orderId, 'READY_FOR_PICKUP')}>
                                Báo Xong
                            </Button>
                        )}

                        {/* READY: Thu ngân thanh toán */}
                        {s === 'READY_FOR_PICKUP' && (
                            <Button
                                type="primary"
                                style={{background: 'green'}}
                                icon={<DollarOutlined />}
                                size="small"
                                onClick={() => handlePaymentClick(record)}
                            >
                                Thanh toán
                            </Button>
                        )}
                    </Space>
                );
            }
        }
    ];

    const items = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'KITCHEN', label: 'Đang chế biến' },
        { key: 'READY', label: 'Chờ trả món' },
        { key: 'HISTORY', label: 'Lịch sử' },
    ];

    return (
        <Card
            title="Quản lý Đơn hàng"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/orders/create')}>
                    Tạo đơn mới (POS)
                </Button>
            }
        >
            <Tabs defaultActiveKey="ALL" items={items} onChange={setActiveTab} />

            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="orderId"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                // Row class để highlight các đơn mới
                rowClassName={(record) => record.status === 'PENDING' ? 'bg-orange-50' : ''}
            />
            <PaymentModal
                open={paymentModalOpen}
                onCancel={() => setPaymentModalOpen(false)}
                order={selectedOrder}
            />
        </Card>
    );
};

export default OrderPage;