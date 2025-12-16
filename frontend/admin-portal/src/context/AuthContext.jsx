import { createContext, useContext, useState, useEffect } from 'react';
import { Spin } from 'antd';
import axiosClient from '../config/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('accessToken');
    });
    const [currentRestaurant, setCurrentRestaurant] = useState(() => {
        const saved = localStorage.getItem('currentRestaurant');
        return saved ? JSON.parse(saved) : null;
    });

    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
                return;
            }

            console.log("Fetching profile...");
            const response = await axiosClient.get('/users/me');

            setUser(response);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch profile:', error);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const login = (token) => {
        localStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
        fetchUserProfile();
    };

    const selectRestaurant = (restaurant) => {
        setCurrentRestaurant(restaurant);
        localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentRestaurant');
        setUser(null);
        setCurrentRestaurant(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Thêm fullscreen={false} hoặc bọc div để hết warning */}
                <Spin size="large" tip="Đang tải hệ thống...">
                    <div style={{ padding: 50 }} />
                </Spin>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, login, logout, isLoading,
            currentRestaurant, selectRestaurant
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);