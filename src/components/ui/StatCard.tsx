import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    trend?: number;
    icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, icon: Icon }) => (
    <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-2.5 rounded-md flex flex-col gap-0 transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)] dark:shadow-none hover:border-primary-dd/30">
        <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{title}</span>
            <Icon size={10} className="text-slate-400 opacity-60" />
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white leading-tight tracking-tighter">{value}</span>
            {trend !== undefined && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trend > 0 ? 'text-[--color-status-success]' : 'text-[--color-status-error]'}`}>
                    {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
                </span>
            )}
        </div>
        {subValue && <div className="text-slate-500 dark:text-slate-400 text-[9px] font-semibold mt-0.5 opacity-80">{subValue}</div>}
    </div>
);

export default StatCard;
