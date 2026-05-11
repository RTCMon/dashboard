import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'bg-primary-dd hover:bg-primary-dd-hover text-white shadow-sm',
        secondary: 'bg-white dark:bg-dd-bg-dark-sidebar border border-dd-border-light dark:border-dd-border-dark text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dd-bg-dark-card',
        danger: 'bg-status-error hover:opacity-90 text-white shadow-sm',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300',
    };

    const sizes = {
        sm: 'px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-6 py-2.5 text-base',
    };

    return (
        <button
            className={`rounded-sm font-semibold transition-all active:scale-[0.98] focus:outline-none flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
