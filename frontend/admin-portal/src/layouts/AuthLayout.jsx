import { Row, Col, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Title, Text } = Typography;

const AuthLayout = () => {
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <Row style={{ height: '100%' }}>
                {/* CỘT TRÁI: Ảnh nền & Branding (Ẩn trên mobile - xs=0) */}
                <Col
                    xs={0} md={12} lg={14} xl={16}
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Lớp phủ tối màu để chữ nổi bật hơn */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '60px'
                    }}>
                        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
                            Quản lý nhà hàng<br />Chuyên nghiệp & Hiệu quả
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                            Hệ thống UniOrder giúp bạn tối ưu quy trình vận hành, quản lý thực đơn và đơn hàng đa kênh một cách dễ dàng.
                        </Text>
                    </div>
                </Col>

                {/* CỘT PHẢI: Nơi chứa Form (Login/Register) */}
                <Col
                    xs={24} md={12} lg={10} xl={8}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        position: 'relative'
                    }}
                >
                    <div style={{ width: '100%', maxWidth: 440, padding: 40 }}>
                        {/* Outlet là nơi LoginPage hoặc RegisterPage sẽ được render vào đây */}
                        <Outlet />
                    </div>

                    <div style={{ position: 'absolute', bottom: 20, textAlign: 'center', width: '100%', color: '#ccc' }}>
                        © 2025 UniOrder Inc.
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AuthLayout;