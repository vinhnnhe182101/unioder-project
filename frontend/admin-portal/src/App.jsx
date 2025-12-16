import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useEffect } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const AppContent = () => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        document.body.style.backgroundColor = isDarkMode ? '#000000' : '#f0f2f5';
    }, [isDarkMode]);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 6,
                },
            }}
        >
            <AntdApp>
                <NotificationProvider>
                    <AppRouter />
                </NotificationProvider>
            </AntdApp>
        </ConfigProvider>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;