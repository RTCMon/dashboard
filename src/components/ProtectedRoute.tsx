import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--color-dd-bg-light] dark:bg-[--color-dd-bg-dark-main]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[--color-primary-dd]/30 border-t-[--color-primary-dd] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading Session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
