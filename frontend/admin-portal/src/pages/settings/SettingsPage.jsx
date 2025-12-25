import { useState, useEffect } from 'react';
import { Tabs, Card, Form, Input, Button, Upload, message, Avatar, Row, Col, Select } from 'antd';
import { UploadOutlined, UserOutlined, BankOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';

const { TabPane } = Tabs;

// URL ảnh local
const BASE_IMG_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

const SettingsPage = () => {
    const { currentRestaurant, selectRestaurant } = useAuth(); // selectRestaurant dùng để update lại context sau khi sửa
    const [loading, setLoading] = useState(false);

    // Form Refs
    const [infoForm] = Form.useForm();
    const [bankForm] = Form.useForm();

    // State cho ảnh
    const [fileList, setFileList] = useState([]);
    const [logoPreview, setLogoPreview] = useState(null);

    // Load data khi vào trang
    useEffect(() => {
        if (currentRestaurant) {
            // 1. Tab Info
            infoForm.setFieldsValue({
                name: currentRestaurant.name,
                address: currentRestaurant.address,
                phoneNumber: currentRestaurant.phoneNumber,
                description: currentRestaurant.description
            });

            // Set preview logo
            if (currentRestaurant.logoUrl) {
                const url = currentRestaurant.logoUrl.startsWith('http') ? currentRestaurant.logoUrl : `${BASE_IMG_URL}/catalog${currentRestaurant.logoUrl}`;
                setLogoPreview(url);
                setFileList([{ uid: '-1', status: 'done', url: url }]);
            }

            // 2. Tab Bank (Fetch API riêng)
            fetchPaymentConfig();
        }
    }, [currentRestaurant]);

    const fetchPaymentConfig = async () => {
        try {
            const config = await restaurantService.getPaymentConfig(currentRestaurant.restId);
            if (config) bankForm.setFieldsValue(config);
        } catch (error) {
            // Có thể chưa cấu hình
        }
    };

    // --- HANDLER TAB INFO ---
    const handleUpdateInfo = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            const data = {
                name: values.name,
                address: values.address,
                phoneNumber: values.phoneNumber,
                description: values.description
            };

            formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            const updatedRes = await restaurantService.updateRestaurant(currentRestaurant.restId, formData);

            message.success('Cập nhật thông tin thành công!');

            // Cập nhật lại Context & LocalStorage để Header hiển thị tên/logo mới
            selectRestaurant({ ...currentRestaurant, ...updatedRes });

        } catch (error) {
            message.error('Lỗi cập nhật: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLER TAB BANK ---
    const handleUpdateBank = async (values) => {
        setLoading(true);
        try {
            await restaurantService.updatePaymentConfig(currentRestaurant.restId, values);
            message.success('Lưu cấu hình ngân hàng thành công!');
        } catch (error) {
            message.error('Lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            // Preview ảnh mới chọn
            setLogoPreview(URL.createObjectURL(newFileList[0].originFileObj));
        }
    };

    // Danh sách ngân hàng phổ biến (Có thể thêm nhiều hơn hoặc gọi API VietQR để lấy list)
    const bankOptions = [
        { value: 'MB', label: 'MB Bank (Quân Đội)' },
        { value: 'VCB', label: 'Vietcombank' },
        { value: 'TCB', label: 'Techcombank' },
        { value: 'ACB', label: 'ACB' },
        { value: 'BIDV', label: 'BIDV' },
        { value: 'ICB', label: 'VietinBank' },
    ];

    return (
        <Card title="Cài đặt Nhà hàng" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Tabs defaultActiveKey="1">
                {/* TAB 1: THÔNG TIN CHUNG */}
                <TabPane tab={<span><UserOutlined />Thông tin chung</span>} key="1">
                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: 16 }}>Logo Nhà Hàng</div>
                            <Avatar
                                shape="square"
                                size={150}
                                src={logoPreview}
                                icon={<UserOutlined />}
                                style={{ marginBottom: 16, border: '1px solid #eee' }}
                            />
                            <Upload
                                fileList={fileList}
                                onChange={handleFileChange}
                                beforeUpload={() => false}
                                maxCount={1}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Thay đổi Logo</Button>
                            </Upload>
                        </Col>
                        <Col span={16}>
                            <Form form={infoForm} layout="vertical" onFinish={handleUpdateInfo}>
                                <Form.Item name="name" label="Tên nhà hàng" rules={[{ required: true }]}>
                                    <Input size="large" />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="phoneNumber" label="Số điện thoại">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="address" label="Địa chỉ">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="description" label="Giới thiệu ngắn">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                                    Lưu thay đổi
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </TabPane>

                {/* TAB 2: CẤU HÌNH THANH TOÁN */}
                <TabPane tab={<span><BankOutlined />Ngân hàng & Thanh toán</span>} key="2">
                    <div style={{ maxWidth: 600, margin: '20px auto' }}>
                        <div style={{ marginBottom: 24, padding: 16, background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                            Thông tin này sẽ được dùng để <b>tạo mã QR tự động</b> cho khách hàng chuyển khoản. Vui lòng nhập chính xác.
                        </div>

                        <Form form={bankForm} layout="vertical" onFinish={handleUpdateBank}>
                            <Form.Item name="bankId" label="Ngân hàng" rules={[{ required: true, message: 'Chọn ngân hàng' }]}>
                                <Select
                                    placeholder="Chọn ngân hàng thụ hưởng"
                                    options={bankOptions}
                                    showSearch
                                />
                            </Form.Item>

                            <Form.Item name="accountNo" label="Số tài khoản" rules={[{ required: true, message: 'Nhập số tài khoản' }]}>
                                <Input placeholder="Ví dụ: 0988xxxxxx" size="large" />
                            </Form.Item>

                            <Form.Item name="accountName" label="Tên chủ tài khoản (Viết hoa không dấu)" rules={[{ required: true, message: 'Nhập tên chủ thẻ' }]}>
                                <Input placeholder="NGUYEN VAN A" style={{ textTransform: 'uppercase' }} />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
                                Lưu Cấu Hình Ngân Hàng
                            </Button>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default SettingsPage;