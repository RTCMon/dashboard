import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    change?: number; // percentage change
    changeLabel?: string;
    isLoading?: boolean;
    format?: 'number' | 'percentage' | 'time';
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    unit = '',
    change,
    changeLabel = 'vs prev period',
    isLoading = false,
    format = 'number'
}) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-4 rounded-md shadow-sm animate-pulse">
                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-24 mb-3"></div>
                <div className="h-8 bg-slate-100 dark:bg-white/5 rounded w-32"></div>
            </div>
        );
    }

    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-5 rounded-md shadow-sm hover:border-primary-dd/30 transition-colors group">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-hover:text-primary-dd transition-colors">
                {title}
            </h3>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {value}{unit}
                </span>
                {change !== undefined && (
                    <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isPositive ? 'text-status-success bg-status-success/10' :
                        isNegative ? 'text-status-error bg-status-error/10' :
                        'text-slate-400 bg-slate-100 dark:bg-white/5'
                    }`}>
                        {isPositive ? <ArrowUpRight size={10} /> :
                         isNegative ? <ArrowDownRight size={10} /> :
                         <Minus size={10} />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                {changeLabel}
            </p>
        </div>
    );
};

export default KPICard;
