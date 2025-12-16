import { Tag } from 'antd';

const OrderStatusBadge = ({ status }) => {
    let color = 'default';
    let text = status;

    switch (status) {
        case 'PENDING':
            color = 'gold';
            text = 'Chờ xác nhận';
            break;
        case 'CONFIRMED':
            color = 'cyan';
            text = 'Đã xác nhận';
            break;
        case 'PREPARING':
            color = 'blue';
            text = 'Đang nấu';
            break;
        case 'READY_FOR_PICKUP':
            color = 'purple';
            text = 'Đã xong';
            break;
        case 'COMPLETED':
            color = 'green';
            text = 'Hoàn thành';
            break;
        case 'CANCELLED':
            color = 'red';
            text = 'Đã hủy';
            break;
        default:
            break;
    }

    return <Tag color={color}>{text}</Tag>;
};

export default OrderStatusBadge;