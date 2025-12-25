import { useState } from 'react';
import { Row, Col, Card, Input, Button, List, Avatar, Tag, Modal, Form, Radio, Checkbox, message, Divider, Space, Typography } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, LeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import catalogService from '../../services/catalogService';
import orderService from '../../services/orderService';
import { resolveImageUrl } from '../../utils/image';

const { Meta } = Card;
const { Title, Text } = Typography;

const POSPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]); // Giỏ hàng
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: catalogService.getProducts,
    });

    const createOrderMutation = useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: () => {
            message.success('Đã tạo đơn hàng thành công!');
            setCart([]);
            navigate('/orders');
        },
        onError: (err) => message.error('Lỗi tạo đơn: ' + err.message)
    });

    // 1. Xử lý khi click vào món ăn
    const handleProductClick = (product) => {
        if (!product.available) {
            message.warning('Món này đang tạm hết hàng!');
            return;
        }

        if (product.options && product.options.length > 0) {
            setSelectedProduct(product);
            setIsModalOpen(true);
            form.resetFields();
        } else {
            addToCart(product, [], 0);
        }
    };

    const updateQuantity = (tempId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.tempId === tempId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null; // Nếu về 0 thì đánh dấu để lọc bỏ (hoặc hỏi xóa)
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean)); // Lọc bỏ item null
    };

    // 2. Xử lý khi submit Modal chọn Option
    const handleOptionSubmit = (values) => {
        let selectedOptions = [];
        let extraPriceTotal = 0;
        selectedProduct.options.forEach(group => {
            const selectedValue = values[`option_${group.optionId}`];
            if (selectedValue) {
                if (Array.isArray(selectedValue)) {
                    selectedValue.forEach(itemId => {
                        const item = group.items.find(i => i.itemId === itemId);
                        if (item) {
                            selectedOptions.push({ name: group.name, choice: item.name, price: item.extraPrice });
                            extraPriceTotal += item.extraPrice;
                        }
                    });
                } else {
                    const item = group.items.find(i => i.itemId === selectedValue);
                    if (item) {
                        selectedOptions.push({ name: group.name, choice: item.name, price: item.extraPrice });
                        extraPriceTotal += item.extraPrice;
                    }
                }
            }
        });
        addToCart(selectedProduct, selectedOptions, extraPriceTotal);
        setIsModalOpen(false);
    };

    // 3. Thêm vào giỏ hàng
    const addToCart = (product, options, extraPrice) => {
        // Tạo key unique dựa trên ID món và Options đã chọn để xem có trùng không
        // Ví dụ: Cùng là Trà sữa nhưng 1 ly 50% đường, 1 ly 100% đường là 2 dòng khác nhau
        // Logic đơn giản: Check ID và stringify options
        const optionStr = JSON.stringify(options.sort((a,b) => a.name.localeCompare(b.name)));

        const existingItem = cart.find(item => item.productId === product.productId && JSON.stringify(item._optionSignature) === optionStr);

        if (existingItem) {
            // Nếu trùng món + option -> Tăng số lượng
            updateQuantity(existingItem.tempId, 1);
            message.success('Đã cập nhật số lượng');
        } else {
            // Món mới
            const newItem = {
                tempId: Date.now(),
                productId: product.productId,
                name: product.name,
                unitPrice: product.price,
                extraPrice: extraPrice,
                totalItemPrice: product.price + extraPrice,
                quantity: 1,
                selectedOptions: options,
                _optionSignature: JSON.parse(optionStr) // Lưu để so sánh sau này
            };
            setCart([...cart, newItem]);
            message.success('Đã thêm vào giỏ');
        }
    };

    // 4. Xóa khỏi giỏ
    const removeFromCart = (tempId) => {
        setCart(cart.filter(item => item.tempId !== tempId));
    };

    // 5. Tính tổng tiền giỏ hàng
    const cartTotal = cart.reduce((sum, item) => sum + (item.totalItemPrice * item.quantity), 0);

    // 6. Gửi đơn hàng (Checkout)
    const handleCheckout = () => {
        if (cart.length === 0) return message.warning('Giỏ hàng trống!');
        const payload = {
            orderType: "DINE_IN",
            note: "Đơn tại quầy",
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                selectedOptionsJson: JSON.stringify(item.selectedOptions)
            }))
        };
        createOrderMutation.mutate(payload);
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 16 }}>
            {/* CỘT TRÁI: DANH SÁCH MÓN */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                <Button icon={<LeftOutlined />} onClick={() => navigate('/orders')} style={{ marginBottom: 16 }}>Quay lại</Button>
                <Row gutter={[16, 16]}>
                    {products?.map(p => (
                        <Col xs={12} sm={8} md={6} lg={6} key={p.productId}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ position: 'relative' }}>
                                        <img alt={p.name} src={resolveImageUrl(p.imgUrl) || "https://via.placeholder.com/150"} style={{ height: 120, width: '100%', objectFit: 'cover', filter: p.available ? 'none' : 'grayscale(100%)' }} />
                                        {!p.available && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Tag color="red" style={{ fontSize: 16, padding: '5px 10px' }}>HẾT HÀNG</Tag>
                                            </div>
                                        )}
                                    </div>
                                }
                                onClick={() => handleProductClick(p)}
                                style={{ opacity: p.available ? 1 : 0.7, pointerEvents: p.available ? 'auto' : 'none' }}
                            >
                                <Meta title={p.name} description={<Text type="danger" strong>{p.price.toLocaleString()}đ</Text>} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* CỘT PHẢI: GIỎ HÀNG */}
            <Card style={{ width: 400, display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0 }}><ShoppingCartOutlined /> Giỏ hàng ({cart.reduce((a,b)=>a+b.quantity,0)})</Title>
                    <Button type="text" danger onClick={() => setCart([])}>Xóa hết</Button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <List
                        dataSource={cart}
                        renderItem={item => (
                            <List.Item>
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>{item.name}</Text>
                                        <Text strong>{(item.totalItemPrice * item.quantity).toLocaleString()}đ</Text>
                                    </div>
                                    {item.selectedOptions.length > 0 && (
                                        <div style={{ fontSize: 12, color: '#666' }}>
                                            {item.selectedOptions.map(o => o.choice).join(', ')}
                                        </div>
                                    )}

                                    {/* Nút Tăng/Giảm Số lượng */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                        <Space>
                                            <Button size="small" icon={<MinusOutlined />} onClick={() => updateQuantity(item.tempId, -1)} />
                                            <Text strong style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Text>
                                            <Button size="small" icon={<PlusOutlined />} onClick={() => updateQuantity(item.tempId, 1)} />
                                        </Space>
                                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeFromCart(item.tempId)} />
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>

                <Divider style={{ margin: '12px 0' }} />
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                    <Text strong>Tổng cộng:</Text>
                    <Text strong type="danger">{cartTotal.toLocaleString()}đ</Text>
                </div>
                <Button type="primary" block size="large" onClick={handleCheckout} loading={createOrderMutation.isPending}>
                    THANH TOÁN & TẠO ĐƠN
                </Button>
            </Card>

            {/* Modal Option giữ nguyên */}
            <Modal title={`Chọn tùy chọn: ${selectedProduct?.name}`} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleOptionSubmit}>
                    {selectedProduct?.options?.map(group => (
                        <Form.Item key={group.optionId} name={`option_${group.optionId}`} label={group.name} rules={[{ required: group.isRequired, message: 'Vui lòng chọn mục này' }]}>
                            {group.multipleChoice ? (
                                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {group.items?.map(item => (
                                        <Checkbox key={item.itemId} value={item.itemId}>{item.name} {item.extraPrice > 0 && `(+${item.extraPrice.toLocaleString()}đ)`}</Checkbox>
                                    ))}
                                </Checkbox.Group>
                            ) : (
                                <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {group.items?.map(item => (
                                        <Radio key={item.itemId} value={item.itemId}>{item.name} {item.extraPrice > 0 && `(+${item.extraPrice.toLocaleString()}đ)`}</Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        </Form.Item>
                    ))}
                    <Button type="primary" htmlType="submit" block>Xác nhận</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default POSPage;