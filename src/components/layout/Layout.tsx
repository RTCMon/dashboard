import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'RTCMon' }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-white dark:bg-dd-bg-dark-main text-slate-700 dark:text-slate-200 transition-colors duration-200">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile by default, shown as drawer */}
            <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:flex overflow-hidden transition-all duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-56'}
      `}>
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <Header
                    title={title}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
