import { useState } from 'react';
import { Form, Input, Button, message, Card, Upload  } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosClient from '../../config/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';

const OnboardingPage = () => {
    const { selectRestaurant } = useAuth();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();

            const restaurantData = {
                name: values.name,
                address: values.address,
                phoneNumber: values.phoneNumber,
                description: values.description
            };

            const jsonBlob = new Blob([JSON.stringify(restaurantData)], { type: 'application/json' });
            formData.append('data', jsonBlob);

            if (fileList.length > 0) {
                formData.append('file', fileList[0].originFileObj);
            }

            const newRestaurantData = await restaurantService.createRestaurant(formData);

            console.log("Auto-selecting restaurant:", newRestaurantData);
            selectRestaurant(newRestaurantData);

            navigate('/', { replace: true });

        } catch (error) {
            message.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Thiết lập nhà hàng của bạn" style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Tên nhà hàng" rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng' }]}>
                        <Input placeholder="Ví dụ: Phở Cồ, Cơm Tấm Sài Gòn..." />
                    </Form.Item>

                    <Form.Item label="Logo nhà hàng">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false} // Chặn auto upload, để gửi cùng form
                            maxCount={1}
                            accept="image/*"
                        >
                            {fileList.length < 1 && (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item name="address" label="Địa chỉ">
                        <Input placeholder="Số 1 Đại Cồ Việt..." />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số điện thoại">
                        <Input placeholder="09xxxxxx" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả ngắn">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large">
                        Bắt đầu kinh doanh
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default OnboardingPage;