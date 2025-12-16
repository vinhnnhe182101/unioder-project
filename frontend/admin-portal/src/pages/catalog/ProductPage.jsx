import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Card, Space, Tag, Image, Switch, Upload  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import catalogService from '../../services/catalogService';

const { Option } = Select;

const BASE_IMG_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

const ProductPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: catalogService.getProducts });
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: catalogService.getCategories });
    const { data: options } = useQuery({ queryKey: ['options'], queryFn: catalogService.getOptions });

    // Mutation tạo sản phẩm
    const saveMutation = useMutation({
        mutationFn: (formData) => {
            if (editingProduct) {
                return catalogService.updateProduct(editingProduct.productId, formData);
            } else {
                return catalogService.createProduct(formData);
            }
        },
        onSuccess: () => {
            message.success(editingProduct ? 'Cập nhật thành công!' : 'Tạo món thành công!');
            handleCloseModal();
            queryClient.invalidateQueries(['products']);
        },
        onError: (err) => message.error('Lỗi: ' + (err.response?.data?.message || err.message)),
    });

    const handleSave = (values) => {
        const formData = new FormData();

        // 1. Chuẩn bị JSON data
        const productData = {
            name: values.name,
            categoryId: values.categoryId,
            price: values.price,
            optionIds: values.optionIds || [],
            description: values.description || '',
            // Nếu không upload file mới, giữ nguyên imgUrl cũ (nếu có logic xử lý bên BE)
            imgUrl: editingProduct ? editingProduct.imgUrl : null
        };

        const jsonBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
        formData.append('data', jsonBlob);

        // 2. Append File nếu có
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        saveMutation.mutate(formData);
    };

    const handleEdit = (record) => {
        setEditingProduct(record);
        form.setFieldsValue({
            name: record.name,
            categoryId: categories?.find(c => c.name === record.categoryName)?.categoryId, // Tìm ID từ tên (hoặc BE trả về ID thì tốt hơn)
            price: record.price,
            description: record.description,
            // Option logic cần map lại nếu BE trả về object
            optionIds: record.options?.map(o => o.optionId)
        });

        // Hiển thị ảnh cũ trong Upload component
        if (record.imgUrl) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: record.imgUrl.startsWith('http') ? record.imgUrl : `${BASE_IMG_URL}/catalog${record.imgUrl}` // Fix đường dẫn ảnh local
            }]);
        } else {
            setFileList([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFileList([]);
        form.resetFields();
    };

    const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const toggleMutation = useMutation({
        mutationFn: ({ id, isAvailable }) => catalogService.toggleProductAvailability(id, isAvailable),
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries(['products']);
        },
        onError: () => message.error('Không thể cập nhật trạng thái')
    });

    const handleCreate = (values) => {
        // Values trả về từ form: { name, price, categoryId, optionIds: [1, 2] }
        // Backend DTO cần: { categoryId, name, price, optionIds... }
        createMutation.mutate(values);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            render: (url) => (
                <Image
                    width={50}
                    // Xử lý link ảnh: Nếu là http (online) thì giữ nguyên, nếu local thì thêm prefix gateway
                    src={url ? (url.startsWith('http') ? url : `${BASE_IMG_URL}/catalog${url}`) : null}
                    fallback="https://via.placeholder.com/50"
                />
            ),
        },
        {
            title: 'Tên món',
            dataIndex: 'name',
            key: 'name',
            render: text => <b>{text}</b>,
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName', // Backend DTO trả về tên danh mục
            key: 'categoryName',
            render: text => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'available',
            key: 'available',
            render: (avail) => <Tag color={avail ? 'green' : 'red'}>{avail ? 'Còn hàng' : 'Hết hàng'}</Tag>
        },
        {
            title: 'Trạng thái (Bán/Ngưng)',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            render: (avail, record) => (
                <Switch
                    checkedChildren="Bán"
                    unCheckedChildren="Hết"
                    checked={avail}
                    loading={toggleMutation.isPending}
                    onChange={(checked) => toggleMutation.mutate({ id: record.productId, isAvailable: checked })}
                />
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
            <Card title="Thực Đơn Món Ăn" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm Món</Button>}>
                <Table columns={columns} dataSource={products} rowKey="productId" loading={isLoading} />
            </Card>

            <Modal
                title={editingProduct ? "Cập nhật món ăn" : "Thêm Món Mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Tên món" rules={[{ required: true }]}><Input /></Form.Item>

                    {/* Upload Ảnh */}
                    <Form.Item label="Hình ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false} // Chặn auto upload
                            maxCount={1}
                            accept="image/*"
                        >
                            {fileList.length < 1 && <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
                        </Upload>
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                            <Select placeholder="Chọn danh mục">
                                {categories?.map(c => <Option key={c.categoryId} value={c.categoryId}>{c.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={0} addonAfter="₫" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                        </Form.Item>
                    </div>

                    <Form.Item name="optionIds" label="Topping / Tùy chọn kèm theo">
                        <Select mode="multiple" placeholder="Chọn các nhóm tùy chọn">
                            {options?.map(o => <Option key={o.optionId} value={o.optionId}>{o.name}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>

                    <Button type="primary" htmlType="submit" block loading={saveMutation.isPending}>
                        {editingProduct ? "Cập nhật" : "Lưu Món Ăn"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductPage;