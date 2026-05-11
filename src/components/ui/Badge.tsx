import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'primary';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
    const styles = {
        success: 'bg-status-success/10 text-status-success border-status-success/20',
        warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
        error: 'bg-status-error/10 text-status-error border-status-error/20',
        neutral: 'bg-status-neutral/10 text-status-neutral border-status-neutral/20',
        primary: 'bg-primary-dd/10 text-primary-dd border-primary-dd/20',
    };

    return (
        <span className={`px-1.5 py-0 rounded-sm text-[8px] font-extrabold uppercase border tracking-wider ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
