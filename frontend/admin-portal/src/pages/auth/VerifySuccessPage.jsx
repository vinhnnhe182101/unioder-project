import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const VerifySuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff' // Nền trắng toàn màn hình
        }}>
            <div style={{ maxWidth: 480, width: '100%', padding: '40px 20px', textAlign: 'center' }}>
                {/* Icon tùy chỉnh hoặc dùng mặc định của Result */}
                <Result
                    icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: 72 }} />}
                    status="success"
                    title={
                        <Title level={2} style={{ margin: '24px 0 8px', color: '#1890ff' }}>
                            Xác thực thành công!
                        </Title>
                    }
                    subTitle={
                        <div style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                            <p>Chào mừng bạn đến với <b>UniOrder</b>.</p>
                            <p>Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng.</p>
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="login"
                            size="large"
                            style={{
                                minWidth: 200,
                                height: 48,
                                fontSize: 16,
                                marginTop: 24,
                                borderRadius: 6
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập ngay
                        </Button>,
                    ]}
                />

                <div style={{ marginTop: 40, color: '#ccc', fontSize: 12 }}>
                    © 2025 UniOrder Inc. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default VerifySuccessPage;