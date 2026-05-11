import React from 'react';

interface MetricChartSkeletonProps {
    title: string;
    unit?: string;
}

const MetricChartSkeleton: React.FC<MetricChartSkeletonProps> = ({ title, unit = 'kbps' }) => {
    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-2.5 rounded-md h-48 flex flex-col transition-colors animate-pulse shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)] dark:shadow-none">
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
