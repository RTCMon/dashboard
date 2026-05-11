import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'primary';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
    const styles = {
        success: 'bg-[--color-status-success]/10 text-[--color-status-success] border-[--color-status-success]/20',
        warning: 'bg-[--color-status-warning]/10 text-[--color-status-warning] border-[--color-status-warning]/20',
        error: 'bg-[--color-status-error]/10 text-[--color-status-error] border-[--color-status-error]/20',
        neutral: 'bg-[--color-status-neutral]/10 text-[--color-status-neutral] border-[--color-status-neutral]/20',
        primary: 'bg-[--color-primary-dd]/10 text-[--color-primary-dd] border-[--color-primary-dd]/20',
    };

    return (
        <span className={`px-1.5 py-0 rounded-[--radius-sm] text-[8px] font-extrabold uppercase border tracking-wider ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
