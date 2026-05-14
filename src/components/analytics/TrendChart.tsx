import React, { useMemo } from 'react';

interface DataPoint {
    timestamp: string;
    value: number;
}

interface TrendChartProps {
    title: string;
    data: DataPoint[];
    height?: number;
    color?: string;
    unit?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
    title,
    data,
    height = 240,
    color = '#4F46E5',
    unit = ''
}) => {
    const { points, areaPath, linePath, max, min, width } = useMemo(() => {
        const w = 1000;
        if (!data || data.length < 2) return { points: [], areaPath: '', linePath: '', max: 0, min: 0, width: w };

        const values = data.map(d => d.value);
        const maxValue = Math.max(...values, 1);
        const minValue = Math.min(...values, 0);
        const range = maxValue - minValue || 1;

        const padding = { top: 40, bottom: 40 };
        const chartHeight = height - padding.top - padding.bottom;
        const step = w / (data.length - 1);

        const pts = data.map((d, i) => ({
            x: i * step,
            y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight
        }));

        const line = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
        const area = `${line} L ${pts[pts.length - 1].x} ${height - padding.bottom} L 0 ${height - padding.bottom} Z`;

        return { points: pts, areaPath: area, linePath: line, max: maxValue, min: minValue, width: w };
    }, [data, height]);

    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span>Trend</span>
                    </div>
                    <span className="opacity-50">Range: {min.toFixed(1)} – {max.toFixed(1)}{unit}</span>
                </div>
            </div>
            <div className="p-6">
                <div className="relative" style={{ height }}>
                    {data && data.length > 1 ? (
                        <svg
                            viewBox={`0 0 ${width} ${height}`}
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id={`trend-gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Horizontal grid lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                                const y = 40 + (height - 80) * p;
                                return (
                                    <line 
                                        key={p} 
                                        x1="0" y1={y} x2={width} y2={y} 
                                        stroke="currentColor" 
                                        strokeOpacity="0.05" 
                                        strokeDasharray="4 4" 
                                    />
                                );
                            })}

                            <path d={areaPath} fill={`url(#trend-gradient-${title})`} />
                            <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            
                            {/* Data points (dots) */}
                            {points.map((p, i) => (
                                <circle 
                                    key={i} 
                                    cx={p.x} cy={p.y} r="3" 
                                    fill={color} 
                                    className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                />
                            ))}
                        </svg>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic">
                            Insufficient data for trend visualization
                        </div>
                    )}
                </div>
                
                {/* Time labels */}
                {data && data.length > 1 && (
                    <div className="flex justify-between mt-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(data[0].timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(data[data.length - 1].timestamp).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendChart;
