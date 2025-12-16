import { useState } from 'react';
import { Form, Input, Button, Typography, message, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await authService.forgotPassword(values.email);
            setIsSuccess(true);
            message.success('Email khôi phục đã được gửi!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Result
                status="success"
                title="Đã gửi email khôi phục"
                subTitle="Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu."
                extra={[
                    <Link key="login" to="/login">
                        <Button type="primary">Quay lại Đăng nhập</Button>
                    </Link>
                ]}
            />
        );
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px' }}>Quên Mật Khẩu?</Title>
                <Text type="secondary">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</Text>
            </div>

            <Form name="forgot_password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Nhập địa chỉ email của bạn" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Gửi Yêu Cầu
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login">Quay lại Đăng nhập</Link>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPasswordPage;