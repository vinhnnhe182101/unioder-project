import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { message, notification } from 'antd';
import { useAuth } from './AuthContext';
import axiosClient from '../config/axiosConfig';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated, currentRestaurant } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClientRef = useRef(null);

    const SOCKET_URL = 'http://localhost:80/ws'; // Gateway endpoint

    // 1. Hàm kết nối WebSocket
    const connectWebSocket = () => {
        if (!isAuthenticated || !currentRestaurant) return;

        console.log(">>> Starting WebSocket connection to:", SOCKET_URL);

        const client = new Client({
            // Dùng SockJS để tương thích tốt hơn qua Gateway
            webSocketFactory: () => new SockJS(SOCKET_URL),

            // Tự động kết nối lại nếu mất mạng
            reconnectDelay: 5000,

            // Debug log (tắt khi production)
            debug: (str) => console.log(str),

            onConnect: () => {
                console.log('Connected to WebSocket');

                const topic = `/topic/restaurant/${currentRestaurant.restId}`;
                console.log(">>> Subscribing to topic:", topic);

                client.subscribe(topic, (message) => {
                    if (message.body) {
                        const newNoti = JSON.parse(message.body);
                        handleNewNotification(newNoti);
                    }
                });
            },

            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClientRef.current = client;
    };

    // 2. Xử lý khi nhận tin nhắn mới
    const handleNewNotification = (noti) => {
        // Thêm vào đầu danh sách
        setNotifications(prev => [noti, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Hiển thị Toast góc màn hình
        notification.info({
            message: noti.title,
            description: noti.message,
            placement: 'bottomRight',
            duration: 5, // Tự tắt sau 5s
        });

        // Nếu là đơn hàng mới -> Có thể phát âm thanh (Ding dong)
        if (noti.type === 'ORDER_CREATED') {
            playNotificationSound();
        }
    };

    const playNotificationSound = () => {
        try {
            console.log(">>> Attempting to play sound...");
            const audio = new Audio('/assets/notification.mp3');

            // Cài đặt volume
            audio.volume = 1.0;

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(">>> Audio playing successfully!");
                    })
                    .catch(error => {
                        console.warn(">>> Audio play blocked by browser:", error);
                        console.warn("Hint: User must interact with the page first (Click anywhere).");
                    });
            }
        } catch (e) {
            console.error("Error initializing audio:", e);
        }
    };

    // 3. Fetch thông báo cũ từ API (Lịch sử)
    const fetchNotifications = async () => {
        if (!currentRestaurant) return;
        try {
            // Cần API GET /api/notifications (Backend chưa có, cần bổ sung)
            // const res = await axiosClient.get('/notifications');
            // setNotifications(res);
            // setUnreadCount(res.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    // Effect: Kết nối khi có User & Restaurant
    useEffect(() => {
        if (isAuthenticated && currentRestaurant) {
            fetchNotifications(); // Lấy tin cũ
            connectWebSocket();   // Lắng nghe tin mới
        }

        // Cleanup khi logout hoặc đổi nhà hàng
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [isAuthenticated, currentRestaurant?.restId]);

    // Hàm đánh dấu đã đọc (gọi API)
    const markAsRead = (id) => {
        // Gọi API PUT /api/notifications/{id}/read
        // Cập nhật state local
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);