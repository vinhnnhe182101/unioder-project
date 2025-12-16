import { Row, Col, Card, Statistic, Spin } from 'antd';
import { DollarCircleOutlined, ShoppingCartOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import reportService from '../../services/reportService';
import RevenueChart from './components/RevenueChart';
import TopProducts from './components/TopProducts'; // (Nếu bạn đã tạo file này)

const DashboardPage = () => {
    // Lấy ngày hôm nay
    const today = dayjs().format('YYYY-MM-DD');

    // 1. Fetch số liệu thống kê hôm nay (Gọi API revenue với range là hôm nay)
    // Chúng ta tận dụng API getRevenue để lấy số liệu tổng quan trong ngày
    const { data: todayStats, isLoading } = useQuery({
        queryKey: ['dashboard-summary', today],
        queryFn: async () => {
            try {
                // Gọi API revenue loại DAY, từ hôm nay đến hôm nay
                const res = await reportService.getRevenue('DAY', today, today);

                // API trả về mảng, lấy phần tử đầu tiên (nếu có)
                if (res && res.length > 0) {
                    // Giả sử API trả về { timePoint, revenue, orderCount }
                    // Nếu DTO backend là totalRevenue thì sửa lại cho khớp
                    return res[0];
                }
                return { revenue: 0, orderCount: 0 };
            } catch (e) {
                console.error("Error fetching dashboard stats:", e);
                return { revenue: 0, orderCount: 0 };
            }
        }
    });

    // Giá trị hiển thị (Nếu đang load thì để 0 hoặc loading)
    // Kiểm tra lại DTO backend trả về trường revenue hay totalRevenue để sửa ở đây
    const revenue = todayStats?.revenue || todayStats?.totalRevenue || 0;
    const orders = todayStats?.orderCount || todayStats?.totalOrders || 0;

    return (
        <div>
            <h2 style={{ marginBottom: 24, fontWeight: 600, color: '#262626' }}>Tổng quan Kinh doanh</h2>

            {/* Thẻ KPI (Hiển thị số liệu thật) */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* THẺ 1: DOANH THU */}
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 8 }}>
                        <Statistic
                            title="Doanh thu hôm nay"
                            value={revenue}
                            prefix={isLoading ? <Spin size="small"/> : <DollarCircleOutlined />}
                            suffix="₫"
                            precision={0}
                            valueStyle={{ color: '#3f8600', fontWeight: 700 }}
                            formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            <RiseOutlined /> Cập nhật: {dayjs().format('HH:mm')}
                        </div>
                    </Card>
                </Col>

                {/* THẺ 2: ĐƠN HÀNG */}
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 8 }}>
                        <Statistic
                            title="Đơn hàng hôm nay"
                            value={orders}
                            prefix={isLoading ? <Spin size="small"/> : <ShoppingCartOutlined />}
                            valueStyle={{ fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            Đơn hàng đã hoàn thành (Paid)
                        </div>
                    </Card>
                </Col>

                {/* THẺ 3: KHÁCH HÀNG (Tạm thời Fake vì chưa có API report khách) */}
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 8 }}>
                        <Statistic
                            title="Khách hàng mới"
                            value={0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            (Tính năng đang cập nhật)
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <RevenueChart />
                </Col>
                <Col xs={24} lg={8}>
                    <TopProducts />
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;