import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Card, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import catalogService from '../../services/catalogService';

const CategoryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    // 1. Fetch dữ liệu danh mục
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: catalogService.getCategories,
    });

    // 2. Mutation tạo danh mục
    const createMutation = useMutation({
        mutationFn: catalogService.createCategory,
        onSuccess: () => {
            message.success('Tạo danh mục thành công!');
            setIsModalOpen(false);
            form.resetFields();
            // Refresh lại bảng dữ liệu
            queryClient.invalidateQueries(['categories']);
        },
        onError: (error) => {
            message.error('Tạo thất bại: ' + (error.response?.data?.message || error.message));
        },
    });

    const handleCreate = (values) => {
        createMutation.mutate(values);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'categoryId',
            key: 'categoryId',
            width: 80,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thứ tự',
            dataIndex: 'displayOrder',
            key: 'displayOrder',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hoạt động' : 'Ẩn'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} style={{ color: 'blue' }} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Quản lý Danh mục"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                        Tạo mới
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="categoryId"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Modal Tạo mới */}
            <Modal
                title="Tạo danh mục mới"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null} // Để Form tự quản lý nút submit
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    initialValues={{ displayOrder: 0 }}
                >
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input placeholder="Ví dụ: Món khai vị" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea placeholder="Mô tả ngắn gọn" />
                    </Form.Item>

                    <Form.Item name="displayOrder" label="Thứ tự hiển thị">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                                Lưu lại
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryPage;