import { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Card, Space, Tag, Row, Col, List, Typography, App } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import catalogService from '../../services/catalogService';

const { Title, Text } = Typography;

const OptionPage = () => {
    const { message, modal } = App.useApp();

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [groupForm] = Form.useForm();
    const [itemForm] = Form.useForm();
    const queryClient = useQueryClient();

    // 1. Fetch Options
    const { data: options, isLoading } = useQuery({
        queryKey: ['options'],
        queryFn: catalogService.getOptions,
    });

    // 2. Mutation tạo Group
    const createGroupMutation = useMutation({
        mutationFn: catalogService.createOption,
        onSuccess: () => {
            message.success('Tạo nhóm tùy chọn thành công!');
            setIsGroupModalOpen(false);
            groupForm.resetFields();
            queryClient.invalidateQueries(['options']);
        },
        onError: (err) => message.error('Lỗi: ' + (err.response?.data?.message || err.message)),
    });

    // 3. Mutation thêm Item
    const createItemMutation = useMutation({
        mutationFn: (values) => catalogService.addOptionItem(selectedGroup.optionId, values),
        onSuccess: () => {
            message.success('Thêm lựa chọn thành công!');
            setIsItemModalOpen(false);
            itemForm.resetFields();
            queryClient.invalidateQueries(['options']);
        },
        onError: (err) => message.error('Lỗi: ' + (err.response?.data?.message || err.message)),
    });

    // 4. Mutation xóa Group
    const deleteGroupMutation = useMutation({
        mutationFn: (optionId) => {
            return Promise.reject(new Error('Chức năng xóa tạm thời không khả dụng'));
        },
        onSuccess: () => {
            message.success('Đã xóa nhóm tùy chọn');
            queryClient.invalidateQueries(['options']);
        },
    });

    const handleCreateGroup = (values) => createGroupMutation.mutate(values);

    const handleCreateItem = (values) => createItemMutation.mutate(values);

    const openAddItemModal = (group) => {
        setSelectedGroup(group);
        setIsItemModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý Topping & Tùy chọn</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsGroupModalOpen(true)}>
                    Tạo Nhóm Mới
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {options?.map(group => (
                    <Col xs={24} md={12} lg={8} key={group.optionId}>
                        <Card
                            title={group.name}
                            extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteGroupMutation.mutate(group.optionId)} />}
                            style={{ height: '100%' }}
                        >
                            <div style={{ marginBottom: 12 }}>
                                <Space wrap>
                                    <Tag color={group.isMultipleChoice ? "blue" : "orange"}>
                                        {group.isMultipleChoice ? "Chọn nhiều" : "Chọn 1"}
                                    </Tag>
                                    <Tag color={group.isRequired ? "red" : "green"}>
                                        {group.isRequired ? "Bắt buộc" : "Không bắt buộc"}
                                    </Tag>
                                </Space>
                            </div>

                            <List
                                size="small"
                                header={<div style={{ fontWeight: 'bold' }}>Danh sách lựa chọn:</div>}
                                footer={<Button type="dashed" block size="small" icon={<PlusOutlined />} onClick={() => openAddItemModal(group)}>Thêm lựa chọn</Button>}
                                bordered
                                dataSource={group.items}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>{item.name}</span>
                                            <span style={{ color: '#888' }}>
                                                {item.extraPrice > 0 ? `+${item.extraPrice.toLocaleString()}đ` : 'Miễn phí'}
                                            </span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal Tạo Nhóm */}
            <Modal title="Tạo Nhóm Tùy Chọn Mới" open={isGroupModalOpen} onCancel={() => setIsGroupModalOpen(false)} footer={null}>
                <Form form={groupForm} layout="vertical" onFinish={handleCreateGroup}>
                    <Form.Item name="name" label="Tên nhóm (Ví dụ: Mức đá)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="isMultipleChoice" label="Loại chọn" initialValue={false}>
                                <Select>
                                    <Select.Option value={false}>Chọn 1 (Radio)</Select.Option>
                                    <Select.Option value={true}>Chọn nhiều (Checkbox)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isRequired" label="Yêu cầu" initialValue={false}>
                                <Select>
                                    <Select.Option value={false}>Không bắt buộc</Select.Option>
                                    <Select.Option value={true}>Bắt buộc chọn</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="displayOrder" label="Thứ tự hiển thị" initialValue={0}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={createGroupMutation.isPending}>Tạo Nhóm</Button>
                </Form>
            </Modal>

            {/* Modal Thêm Item */}
            <Modal title={`Thêm lựa chọn vào "${selectedGroup?.name}"`} open={isItemModalOpen} onCancel={() => setIsItemModalOpen(false)} footer={null}>
                <Form form={itemForm} layout="vertical" onFinish={handleCreateItem}>
                    <Form.Item name="name" label="Tên lựa chọn (Ví dụ: 50% đá)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="extraPrice" label="Giá thêm (VNĐ)" initialValue={0}>
                        <InputNumber min={0} style={{ width: '100%' }} addonAfter="₫" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>
                    <Form.Item name="displayOrder" label="Thứ tự" initialValue={0}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={createItemMutation.isPending}>Lưu Lựa Chọn</Button>
                </Form>
            </Modal>
        </div>
    );
};

import { Select } from 'antd';
export default OptionPage;