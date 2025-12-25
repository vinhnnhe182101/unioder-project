import { useState } from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Typography,
    message,
    Tabs,
    Modal,
    Input,
    Popconfirm
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FireOutlined,
    BellOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import dayjs from 'dayjs';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import OrderDetailModal from './components/OrderDetailModal';
import PaymentModal from './components/PaymentModal';

const { Text } = Typography;
const { TextArea } = Input;

const OrderPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('ALL');

    // Modal chi tiết
    const [detailOrder, setDetailOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Modal thanh toán
    const [paymentOrder, setPaymentOrder] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // ❗ Modal hủy đơn
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelOrderId, setCancelOrderId] = useState(null);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getMyOrders,
        refetchInterval: 15000,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }) =>
            orderService.updateStatus(orderId, status),
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries(['orders']);
        },
        onError: err => message.error(err.message),
    });

    const cancelOrderMutation = useMutation({
        mutationFn: ({ orderId, reason }) =>
            orderService.cancelOrder(orderId, reason),
        onSuccess: () => {
            message.success('Đã hủy đơn hàng');
            queryClient.invalidateQueries(['orders']);
            setCancelModalOpen(false);
            setCancelReason('');
        },
        onError: err => message.error(err.message),
    });

    const handleStatusChange = (orderId, status) => {
        updateStatusMutation.mutate({ orderId, status });
    };

    // 👉 Mở modal hủy
    const openCancelModal = (orderId) => {
        setCancelOrderId(orderId);
        setCancelModalOpen(true);
    };

    // 👉 Xác nhận hủy
    const confirmCancelOrder = () => {
        if (!cancelReason.trim()) {
            message.warning('Vui lòng nhập lý do hủy');
            return;
        }

        cancelOrderMutation.mutate({
            orderId: cancelOrderId,
            reason: cancelReason
        });
    };

    const filteredOrders = orders?.filter(order => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return order.status === 'PENDING';
        if (activeTab === 'KITCHEN')
            return ['CONFIRMED', 'PREPARING'].includes(order.status);
        if (activeTab === 'READY') return order.status === 'READY_FOR_PICKUP';
        if (activeTab === 'HISTORY')
            return ['COMPLETED', 'CANCELLED'].includes(order.status);
        return true;
    });

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderNumber',
            render: t => <b>{t}</b>,
            width: 100,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: d => dayjs(d).format('HH:mm DD/MM'),
            width: 130,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            render: a => <Text strong>{a?.toLocaleString()}đ</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: s => <OrderStatusBadge status={s} />,
        },
        {
            title: 'Hành động',
            width: 320,
            render: (_, record) => {
                const s = record.status;

                return (
                    <Space wrap>
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => {
                                setDetailOrder(record);
                                setIsDetailOpen(true);
                            }}
                        >
                            Xem
                        </Button>

                        {s === 'PENDING' && (
                            <>
                                <Popconfirm
                                    title="Nhận đơn này?"
                                    onConfirm={() =>
                                        handleStatusChange(record.orderId, 'CONFIRMED')
                                    }
                                >
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Nhận
                                    </Button>
                                </Popconfirm>

                                <Button
                                    danger
                                    size="small"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => openCancelModal(record.orderId)}
                                >
                                    Hủy
                                </Button>
                            </>
                        )}

                        {s === 'CONFIRMED' && (
                            <Button
                                type="primary"
                                ghost
                                size="small"
                                icon={<FireOutlined />}
                                onClick={() =>
                                    handleStatusChange(record.orderId, 'PREPARING')
                                }
                            >
                                Nấu
                            </Button>
                        )}

                        {s === 'PREPARING' && (
                            <Button
                                type="primary"
                                size="small"
                                icon={<BellOutlined />}
                                onClick={() =>
                                    handleStatusChange(
                                        record.orderId,
                                        'READY_FOR_PICKUP'
                                    )
                                }
                            >
                                Xong
                            </Button>
                        )}

                        {s === 'READY_FOR_PICKUP' && (
                            <Button
                                type="primary"
                                size="small"
                                icon={<DollarOutlined />}
                                onClick={() => {
                                    setPaymentOrder(record);
                                    setIsPaymentOpen(true);
                                }}
                            >
                                Thu tiền
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    const tabs = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'KITCHEN', label: 'Bếp' },
        { key: 'READY', label: 'Chờ trả món' },
        { key: 'HISTORY', label: 'Lịch sử' },
    ];

    return (
        <>
            <Card
                title="Quản lý Đơn hàng"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/orders/create')}
                    >
                        Tạo đơn mới (POS)
                    </Button>
                }
            >
                <Tabs items={tabs} onChange={setActiveTab} />

                <Table
                    rowKey="orderId"
                    columns={columns}
                    dataSource={filteredOrders}
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                />

                <OrderDetailModal
                    open={isDetailOpen}
                    order={detailOrder}
                    onCancel={() => setIsDetailOpen(false)}
                />

                <PaymentModal
                    open={isPaymentOpen}
                    order={paymentOrder}
                    onCancel={() => setIsPaymentOpen(false)}
                />
            </Card>

            {/* 🔴 MODAL HỦY ĐƠN */}
            <Modal
                title="Hủy đơn hàng"
                open={cancelModalOpen}
                onOk={confirmCancelOrder}
                okText="Xác nhận hủy"
                okButtonProps={{ danger: true }}
                confirmLoading={cancelOrderMutation.isLoading}
                onCancel={() => setCancelModalOpen(false)}
            >
                <TextArea
                    rows={4}
                    placeholder="Nhập lý do hủy đơn..."
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default OrderPage;
