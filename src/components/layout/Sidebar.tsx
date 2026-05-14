import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    Users,
    Settings,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Zap,
    Clock,
    BarChart3,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapsed }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className={`bg-slate-100 dark:bg-[--color-dd-bg-dark-sidebar] border-r border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
            <div className="p-4 flex items-center justify-between border-b border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] h-12">
                <div className={`flex items-center gap-2 overflow-hidden transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <div className="w-7 h-7 bg-[--color-primary-dd] rounded-md flex items-center justify-center text-white font-bold shrink-0">RM</div>
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">RTCMon</span>
                </div>
                <button
                    onClick={toggleCollapsed}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
                <NavItem to="/" icon={LayoutDashboard} label="Overview" collapsed={isCollapsed} />
                <NavItem to="/conferences" icon={Activity} label="Conferences" collapsed={isCollapsed} />
                <NavItem to="/analytics" icon={BarChart3} label="Analytics" collapsed={isCollapsed} />
                <NavItem to="/lookup" icon={Search} label="User Lookup" collapsed={isCollapsed} />
                <NavItem to="/team" icon={Users} label="Team" collapsed={isCollapsed} />
                <NavItem to="/settings" icon={Settings} label="Settings" collapsed={isCollapsed} />

                <div className="pt-4 pb-2">
                    {!isCollapsed && <div className="px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-2">Developer</div>}
                    <a
                        href="http://localhost:8081/swagger"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-[--radius-sm] text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors group"
                    >
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-[--color-primary-dd]" />
                        {!isCollapsed && <span className="whitespace-nowrap">API Documentation</span>}
                    </a>
                </div>
            </nav>

            <div className="p-3 border-t border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] space-y-3">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleTheme}
                    className={`w-full transition-all flex items-center ${isCollapsed ? 'px-0 justify-center' : 'justify-start gap-2'}`}
                >
                    {theme === 'dark' ? <Zap size={14} /> : <Clock size={14} />}
                    {!isCollapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
                </Button>

                <div className={`flex items-center justify-between gap-2 overflow-hidden transition-all ${isCollapsed ? 'flex-col gap-3' : ''}`}>
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[--color-primary-dd] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm shadow-[--color-primary-dd]/20">
                            {user?.name?.[0] || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="text-[10px] min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</div>
                                <div className="text-slate-500 truncate">{user?.email || 'Pro Org'}</div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`text-slate-400 hover:text-[--color-status-error] transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 ${isCollapsed ? 'mt-1' : ''}`}
                        title="Logout"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

const NavItem: React.FC<{ to: string, icon: any, label: string, collapsed: boolean }> = ({ to, icon: Icon, label, collapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex items-center gap-2.5 px-3 py-1.5 rounded-[--radius-sm] text-xs font-medium transition-all group
        ${isActive
                    ? 'bg-[--color-primary-dd]/10 text-[--color-primary-dd] dark:bg-[--color-primary-dd]/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'}
      `}
        >
            <Icon size={14} className="shrink-0 transition-colors" />
            <span className={`whitespace-nowrap transition-all ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {label}
            </span>
        </NavLink>
    );
};

export default Sidebar;
