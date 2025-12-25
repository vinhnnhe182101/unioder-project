import { useState } from 'react';
import {
    Table, Card, Button, Space, Tag, Modal, Form,
    Input, Select, Popconfirm, Avatar, Typography, message, Tooltip
} from 'antd';
import {
    UserAddOutlined, DeleteOutlined,
    UserOutlined, MailOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import staffService from '../../services/staffService';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { currentRestaurant } = useAuth(); // Lấy ID nhà hàng hiện tại

    // 1. Fetch danh sách nhân viên
    const { data: staffs, isLoading } = useQuery({
        queryKey: ['staffs', currentRestaurant?.restId],
        queryFn: () => staffService.getStaffList(currentRestaurant?.restId),
        enabled: !!currentRestaurant, // Chỉ fetch khi đã chọn nhà hàng
    });

    // 2. Mutation Thêm nhân viên
    const addStaffMutation = useMutation({
        mutationFn: (values) => staffService.addStaff(currentRestaurant.restId, values.email, values.roleName),
        onSuccess: () => {
            message.success('Thêm nhân viên thành công!');
            setIsModalOpen(false);
            form.resetFields();
            queryClient.invalidateQueries(['staffs']);
        },
        onError: (error) => {
            message.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    });

    // 3. Mutation Xóa nhân viên
    const removeStaffMutation = useMutation({
        mutationFn: ({ userId, roleName }) => staffService.removeStaff(currentRestaurant.restId, userId, roleName),
        onSuccess: () => {
            message.success('Đã xóa nhân viên khỏi nhà hàng');
            queryClient.invalidateQueries(['staffs']);
        },
        onError: (error) => {
            message.error('Lỗi xóa: ' + (error.response?.data?.message || error.message));
        }
    });

    const handleAddStaff = (values) => {
        addStaffMutation.mutate(values);
    };

    const columns = [
        {
            title: 'Nhân viên',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatarUrl} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.fullName || 'Chưa cập nhật tên'}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <MailOutlined /> {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (role) => {
                let color = 'blue';
                let label = role;
                // Map role code sang tên hiển thị đẹp hơn
                if (role === 'ROLE_OWNER') { color = 'gold'; label = 'Chủ nhà hàng'; }
                if (role === 'ROLE_MANAGER') { color = 'magenta'; label = 'Quản lý'; }
                if (role === 'ROLE_CHEF') { color = 'orange'; label = 'Đầu bếp'; }
                if (role === 'ROLE_WAITER') { color = 'green'; label = 'Phục vụ'; }

                return <Tag color={color} icon={<SafetyCertificateOutlined />}>{label}</Tag>;
            },
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.roleName !== 'ROLE_OWNER' && ( // Không cho phép xóa chủ quán
                        <Popconfirm
                            title="Xóa nhân viên?"
                            description={`Bạn có chắc muốn xóa ${record.fullName} khỏi nhà hàng?`}
                            onConfirm={() => removeStaffMutation.mutate({ userId: record.userId, roleName: record.roleName })}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: removeStaffMutation.isPending }}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card
                title={<span><UserOutlined /> Danh sách nhân sự - {currentRestaurant?.name}</span>}
                extra={
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Thêm nhân viên
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={staffs}
                    rowKey={(record) => `${record.userId}-${record.roleName}`} // Key unique (vì 1 user có thể có nhiều role nếu DB cho phép)
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Thêm nhân viên vào nhà hàng"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddStaff}>
                    <Form.Item
                        name="email"
                        label="Email nhân viên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Nhập email nhân viên đã đăng ký UniOrder" />
                    </Form.Item>

                    <Form.Item
                        name="roleName"
                        label="Chức vụ"
                        rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="ROLE_MANAGER">Quản lý (Manager)</Option>
                            <Option value="ROLE_CHEF">Đầu bếp (Chef)</Option>
                            <Option value="ROLE_WAITER">Phục vụ (Waiter)</Option>
                        </Select>
                    </Form.Item>

                    <div style={{ marginBottom: 16 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            * Lưu ý: Nhân viên phải có tài khoản UniOrder trước. Nếu chưa có, vui lòng yêu cầu họ đăng ký tài khoản mới.
                        </Text>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={addStaffMutation.isPending}>
                                Thêm ngay
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default StaffPage;
