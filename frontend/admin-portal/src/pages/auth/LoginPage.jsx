import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Logic chuyển hướng nếu đã login
    useEffect(() => {
        if (isAuthenticated) {
            const hasRest = localStorage.getItem('currentRestaurant');
            if (hasRest) {
                navigate('/', { replace: true });
            } else {
                navigate('/select-restaurant', { replace: true });
            }
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log("Submitting login...");

            // [SỬA] Dùng service thay vì gọi axios trực tiếp
            const response = await authService.login(values);

            console.log("Login Response:", response);

            const token = response.accessToken || response.token;
            if (token) {
                message.success('Đăng nhập thành công!');
                login(token);
                // Navigate được xử lý bởi useEffect ở trên
            } else {
                message.error("Lỗi hệ thống: Không nhận được Token!");
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px' }}>Đăng Nhập</Title>
                <Text type="secondary">Chào mừng quay trở lại UniOrder Admin</Text>
            </div>

            <Form
                name="login_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <a style={{ float: 'right' }} href="#">Quên mật khẩu?</a>
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;