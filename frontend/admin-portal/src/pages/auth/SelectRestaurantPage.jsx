import { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Spin, Avatar, Tag, Empty, Modal, Input, message } from 'antd';
import { ShopOutlined, PlusOutlined, ArrowRightOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const SelectRestaurantPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const navigate = useNavigate();
    const { selectRestaurant } = useAuth();

    useEffect(() => {
        fetchMyRestaurants();
    }, []);

    const fetchMyRestaurants = async () => {
        try {
            const res = await restaurantService.getMyRestaurants();
            setRestaurants(res || []);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (restaurant) => {
        selectRestaurant(restaurant);
        message.success(`Đang truy cập: ${restaurant.name}`);
        navigate('/');
    };

    const handleCreateNew = () => {
        navigate('/onboarding');
    };

    const handleJoinSubmit = (values) => {
        message.info("Tính năng tham gia bằng mã đang phát triển...");
        setIsJoinModalOpen(false);
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>Chọn Chi Nhánh Làm Việc</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>Bạn đang là thành viên của {restaurants.length} nhà hàng</Text>
            </div>

            <Card style={{ width: 600, borderRadius: 12, boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={restaurants}
                    locale={{ emptyText: <Empty description="Bạn chưa tham gia nhà hàng nào" /> }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button type="link" icon={<ArrowRightOutlined />} onClick={() => handleSelect(item)}>
                                    Truy cập
                                </Button>
                            ]}
                            className="hover:bg-gray-50"
                            style={{ cursor: 'pointer', padding: '16px' }}
                            onClick={() => handleSelect(item)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar shape="square" size={54} icon={<ShopOutlined />} src={item.logoUrl} style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} />
                                }
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</span>
                                        {item.status === 'ACTIVE' && <Tag color="success">Hoạt động</Tag>}
                                        {item.status === 'PENDING_APPROVAL' && <Tag color="warning">Chờ duyệt</Tag>}
                                    </div>
                                }
                                description={
                                    <div>
                                        <div>{item.address || "Chưa cập nhật địa chỉ"}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>ID: {item.restId}</div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />

                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 12 }}>
                    <Button type="primary" block size="large" icon={<PlusOutlined />} onClick={handleCreateNew}>
                        Tạo Nhà hàng Mới
                    </Button>
                    <Button block size="large" icon={<TeamOutlined />} onClick={() => setIsJoinModalOpen(true)}>
                        Tham gia bằng Mã
                    </Button>
                </div>
            </Card>

            <Modal title="Tham gia nhà hàng" open={isJoinModalOpen} onCancel={() => setIsJoinModalOpen(false)} footer={null}>
                <div style={{ padding: 20, textAlign: 'center' }}>
                    <Text>Nhập mã định danh nhà hàng hoặc mã nhân viên được cấp:</Text>
                    <Input.Search
                        placeholder="Ví dụ: REST-123456"
                        enterButton="Tham gia"
                        size="large"
                        style={{ marginTop: 16 }}
                        onSearch={handleJoinSubmit}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default SelectRestaurantPage;