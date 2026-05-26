// routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { VerifySuccessPage, VerifyFailPage } from '../features/auth/pages/VerifyPages';
import { HomePage } from '../features/auth/pages/HomePage';

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-success" element={<VerifySuccessPage />} />
                <Route path="/verify-fail" element={<VerifyFailPage />} />
            </Routes>
        </BrowserRouter>
    );
};