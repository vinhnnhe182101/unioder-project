import { useState } from 'react';
import { Form, Input, Button, Typography, message, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    // [MỚI] State để kiểm soát việc hiển thị màn hình thành công
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const registerData = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber
            };

            await authService.register(registerData);

            // [SỬA] Không navigate ngay, mà set trạng thái thành công
            setIsSuccess(true);
            message.success('Đăng ký thành công!');
        } catch (error) {
            const msg = error.response?.data?.message || 'Đăng ký thất bại.';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // [MỚI] Giao diện khi đăng ký thành công
    if (isSuccess) {
        return (
            <Result
                status="success"
                title="Đăng ký tài khoản thành công!"
                subTitle="Vui lòng kiểm tra hộp thư email của bạn (bao gồm cả mục Spam) để kích hoạt tài khoản trước khi đăng nhập."
                extra={[
                    <Button type="primary" key="login" onClick={() => navigate('/login')}>
                        Quay lại Đăng nhập
                    </Button>,
                ]}
            />
        );
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px' }}>Đăng Ký</Title>
                <Text type="secondary">Tạo tài khoản quản lý nhà hàng mới</Text>
            </div>

            <Form
                name="register_form"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                scrollToFirstError
            >
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập Họ tên!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item name="phoneNumber">
                    <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại (Tùy chọn)" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng Ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </div>
            </Form>
        </div>
    );
};

export default RegisterPage;