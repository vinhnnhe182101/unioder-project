import { Result, Button, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CloseCircleFilled } from '@ant-design/icons';

const { Title } = Typography;

const VerifyFailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const errorMsg = searchParams.get('error') || "Đường dẫn xác thực không hợp lệ hoặc đã hết hạn.";

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff'
        }}>
            <div style={{ maxWidth: 480, width: '100%', padding: '40px 20px', textAlign: 'center' }}>
                <Result
                    icon={<CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 72 }} />}
                    status="error"
                    title={
                        <Title level={2} style={{ margin: '24px 0 8px', color: '#ff4d4f' }}>
                            Xác thực thất bại
                        </Title>
                    }
                    subTitle={
                        <div style={{ fontSize: 16, color: '#666', background: '#fff1f0', padding: 16, borderRadius: 8, border: '1px solid #ffa39e' }}>
                            {decodeURIComponent(errorMsg)}
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="login"
                            size="large"
                            danger // Nút màu đỏ cho hợp tone lỗi
                            style={{
                                minWidth: 200,
                                height: 48,
                                fontSize: 16,
                                marginTop: 24,
                                borderRadius: 6
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Quay lại Đăng nhập
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

export default VerifyFailPage;