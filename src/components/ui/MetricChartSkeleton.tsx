import React from 'react';

interface MetricChartSkeletonProps {
    title: string;
    unit?: string;
}

const MetricChartSkeleton: React.FC<MetricChartSkeletonProps> = ({ title, unit = 'kbps' }) => {
    return (
        <div className="bg-white dark:bg-[--color-dd-bg-dark-card] border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] p-2.5 rounded-[--radius-sm] h-48 flex flex-col transition-colors animate-pulse">
            <div className="flex justify-between mb-2">
                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">{title}</span>
                <span className="text-[9px] text-slate-400 font-mono opacity-70">{unit}</span>
            </div>
            <div className="flex-1 flex items-end gap-1 overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t-[1px]"
                        style={{
                            height: `${Math.random() * 70 + 10}%`,
                            opacity: 0.2 + Math.random() * 0.3
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default MetricChartSkeleton;
