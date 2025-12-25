import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifySuccessPage from '../pages/auth/VerifySuccessPage';
import VerifyFailPage from '../pages/auth/VerifyFailPage';

import SelectRestaurantPage from '../pages/auth/SelectRestaurantPage';
import OnboardingPage from '../pages/dashboard/OnboardingPage';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRouter from './ProtectedRouter';
import CategoryPage from '../pages/catalog/CategoryPage';
import ProductPage from '../pages/catalog/ProductPage';
import OptionPage from '../pages/catalog/OptionPage';
import OrderPage from '../pages/orders/OrderPage';
import POSPage from '../pages/orders/POSPage';
import NotificationPage from '../pages/notifications/NotificationPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import StaffPage from '../pages/staff/StaffPage';

const RestaurantGuard = () => {
    const restaurant = localStorage.getItem('currentRestaurant');
    if (!restaurant) {
        return <Navigate to="/select-restaurant" replace />;
    }
    return <Outlet />;
};

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            element: <AuthLayout />,
            children: [
                { path: '/login', element: <LoginPage /> },
                { path: '/register', element: <RegisterPage /> },
                { path: '/forgot-password', element: <ForgotPasswordPage /> },
                { path: '/reset-password', element: <ResetPasswordPage /> },
                { path: '/verify-success', element: <VerifySuccessPage /> },
                { path: '/verify-fail', element: <VerifyFailPage /> },
            ]
        },
        {
            path: '/',
            element: (
                <ProtectedRouter>
                    <MainLayout />
                </ProtectedRouter>
            ),
            children: [
                {
                    path: 'select-restaurant',
                    element: <SelectRestaurantPage />
                },
                {
                    path: 'onboarding',
                    element: <OnboardingPage />
                },

                {
                    element: <RestaurantGuard />,
                    children: [
                        { path: '', element: <DashboardPage /> },
                        { path: 'orders', element: <OrderPage /> },
                        { path: 'orders/create', element: <POSPage /> },
                        { path: 'catalog/categories', element: <CategoryPage /> },
                        { path: 'catalog/products', element: <ProductPage /> },
                        { path: 'catalog/options', element: <OptionPage /> },
                        { path: 'notifications', element: <NotificationPage /> },
                        {path: 'staff', element: <StaffPage /> },
                        { path: 'profile', element: <ProfilePage /> }
                    ]
                },
                { path: 'settings', element: <SettingsPage /> }
            ]
        },
        {
            path: '*',
            element: <Navigate to="/" replace />,
        }
    ]);

    return <RouterProvider router={router} />;
};

export default AppRouter;