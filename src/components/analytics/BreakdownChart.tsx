import React from 'react';

interface BreakdownData {
    label: string;
    value: number;
    percentage: number;
}

interface BreakdownChartProps {
    title: string;
    data: BreakdownData[];
    color?: string;
    isLoading?: boolean;
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({
    title,
    data,
    color = '#4F46E5',
    isLoading = false
}) => {
    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-3 border-b border-dd-border-light dark:border-dd-border-dark bg-slate-50/50 dark:bg-white/5">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{title}</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-1.5">
                                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-20"></div>
                                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                        No breakdown data available
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="space-y-1.5 group">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary-dd transition-colors">{item.label}</span>
                                    <span className="text-slate-500 font-mono">{item.percentage.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ 
                                            width: `${item.percentage}%`,
                                            backgroundColor: color,
                                            opacity: 0.7 + (1 - index / data.length) * 0.3
                                        }}
                                    ></div>
                                </div>
                                <div className="text-[9px] text-slate-400 font-mono text-right">
                                    {item.value.toLocaleString()} sessions
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BreakdownChart;
