import { List, Card, Avatar, Tag, Typography, Spin, Empty } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import reportService from '../../../services/reportService';
import dayjs from 'dayjs';

const { Text } = Typography;

const TopProducts = () => {
    // Mặc định lấy tháng này
    const from = dayjs().startOf('month').format('YYYY-MM-DD');
    const to = dayjs().endOf('month').format('YYYY-MM-DD');

    const { data: products, isLoading } = useQuery({
        queryKey: ['top-products', from, to],
        queryFn: () => reportService.getTopProducts({ from, to }),
    });

    return (
        <Card title={<span><FireOutlined style={{ color: '#ff4d4f' }} /> Món Bán Chạy (Tháng này)</span>} style={{ height: '100%' }}>
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>
            ) : (products && products.length > 0) ? (
                <List
                    itemLayout="horizontal"
                    dataSource={products.slice(0, 5)} // Top 5
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{ backgroundColor: index === 0 ? '#ff4d4f' : index === 1 ? '#faad14' : '#d9d9d9', color: 'white' }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                }
                                title={<Text strong>{item.productName}</Text>}
                                description={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Đã bán: {item.quantitySold}</Text>
                                        <Text type="success">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.revenueGenerated)}</Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Chưa có dữ liệu bán hàng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Card>
    );
};

export default TopProducts;