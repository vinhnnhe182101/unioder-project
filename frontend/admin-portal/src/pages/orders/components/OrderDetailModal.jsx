import { Modal, Descriptions, Table, Tag, Typography, Button } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const OrderDetailModal = ({ open, onCancel, order }) => {
    // Nếu chưa chọn đơn hàng nào thì không render gì
    if (!order) return null;

    const itemsColumns = [
        {
            title: 'Món ăn',
            dataIndex: 'productName',
            key: 'productName',
            render: text => <b>{text}</b>
        },
        {
            title: 'Tùy chọn',
            dataIndex: 'selectedOptions',
            key: 'selectedOptions',
            render: (text) => {
                if (!text) return '-';
                try {
                    // Backend lưu JSON string, cần parse ra để hiển thị
                    const opts = JSON.parse(text);
                    if (!Array.isArray(opts)) return text;
                    return opts.map((o, idx) => (
                        <div key={idx} style={{ fontSize: 12, color: '#666' }}>
                            {o.name}: {o.choice} {o.price > 0 ? `(+${o.price.toLocaleString()}đ)` : ''}
                        </div>
                    ));
                } catch(e) { return text; }
            }
        },
        {
            title: 'Đơn giá',
            dataIndex: 'unitPrice',
            render: p => p?.toLocaleString() + 'đ'
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            align: 'center'
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            align: 'right',
            render: p => <b>{p?.toLocaleString()}đ</b>
        },
    ];

    return (
        <Modal
            title={`Chi tiết đơn hàng #${order.orderNumber}`}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>Đóng</Button>,
                <Button key="print" type="primary" onClick={() => window.print()}>In hóa đơn</Button>
            ]}
            width={800}
        >
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Mã đơn">{order.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Thời gian">{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Loại đơn"><Tag color="blue">{order.orderType}</Tag></Descriptions.Item>
                <Descriptions.Item label="Trạng thái"><Tag color="orange">{order.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Tổng tiền" span={2}>
                    <Text type="danger" strong style={{ fontSize: 18 }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>{order.note || 'Không có'}</Descriptions.Item>
            </Descriptions>

            <Table
                columns={itemsColumns}
                dataSource={order.items}
                rowKey="orderItemId"
                pagination={false}
                size="small"
                bordered
            />
        </Modal>
    );
};

export default OrderDetailModal;