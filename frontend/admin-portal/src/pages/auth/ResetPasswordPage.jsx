import { useState } from 'react';
import { Form, Input, Button, Typography, message, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    // Nếu không có token trên URL -> Lỗi
    if (!token) {
        return (
            <Result
                status="error"
                title="Đường dẫn không hợp lệ"
                subTitle="Vui lòng kiểm tra lại email của bạn."
                extra={<Button type="primary" onClick={() => navigate('/login')}>Về trang chủ</Button>}
            />
        );
    }

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, values.newPassword);
            setIsSuccess(true);
            message.success('Đổi mật khẩu thành công!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Token hết hạn hoặc không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Result
                status="success"
                title="Đổi mật khẩu thành công!"
                extra={[
                    <Button type="primary" key="login" onClick={() => navigate('/login')}>
                        Đăng nhập ngay
                    </Button>,
                ]}
            />
        );
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px' }}>Đặt Lại Mật Khẩu</Title>
                <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn</Text>
            </div>

            <Form name="reset_password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Xác Nhận
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login">Hủy bỏ</Link>
                </div>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;