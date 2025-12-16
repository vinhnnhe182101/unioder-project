import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, Avatar, message, Row, Col } from 'antd';
import { UserOutlined, UploadOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const ProfilePage = () => {
    const { user, login } = useAuth(); // login dùng để update lại context sau khi sửa
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    // URL hiển thị ảnh (nếu lưu local thì cần prefix)
    // Tạm giả định user-service trả về full URL hoặc bạn xử lý prefix tương tự ProductPage
    const avatarUrl = user?.avatarUrl;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
            });
            if (avatarUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'avatar.png',
                    status: 'done',
                    url: avatarUrl
                }]);
            }
        }
    }, [user, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // JSON data
            const profileData = {
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                // address: values.address // Nếu có
            };
            const jsonBlob = new Blob([JSON.stringify(profileData)], { type: 'application/json' });
            formData.append('data', jsonBlob);

            // File
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            const updatedUser = await userService.updateProfile(formData);

            message.success('Cập nhật hồ sơ thành công!');

            // Cập nhật lại context (vẫn giữ token cũ, chỉ update user data)
            // Lưu ý: Hàm login hiện tại của bạn chỉ nhận token.
            // Bạn có thể cần gọi lại fetchUserProfile trong AuthContext để reload data
            // Hoặc reload trang: window.location.reload();
            window.location.reload();

        } catch (error) {
            message.error('Lỗi cập nhật: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Card title="Hồ sơ cá nhân">
                <Row gutter={24}>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
                        <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Đổi Avatar</Button>
                        </Upload>
                    </Col>
                    <Col span={16}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item label="Email" extra="Email không thể thay đổi">
                                <Input value={user?.email} disabled />
                            </Form.Item>

                            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item name="phoneNumber" label="Số điện thoại">
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" loading={loading}>
                                Lưu thay đổi
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProfilePage;