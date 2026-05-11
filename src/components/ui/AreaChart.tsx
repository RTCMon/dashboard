import React from 'react';

interface DataPoint {
    label: string;
    value: number;
}

interface AreaChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
    gradientId?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
    data,
    height = 200,
    color = '#7C3AED',
    gradientId = 'chart-gradient'
}) => {
    if (!data.length) return null;

    const max = Math.max(...data.map(d => d.value), 1);
    const width = 1000; // Viewbox width
    const step = width / (data.length - 1);

    const points = data.map((d, i) => ({
        x: i * step,
        y: height - (d.value / max) * (height - 20) - 10
    }));

    const pathData = `M 0 ${height} ` +
        points.map(p => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${width} ${height} Z`;

    const lineData = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                </linearGradient>
            </defs>

            {/* Area */}
            <path d={pathData} fill={`url(#${gradientId})`} />

            {/* Line */}
            <path d={lineData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Horizontal Grid lines (simplified) */}
            <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="currentColor" strokeOpacity="0.05" />
            <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="currentColor" strokeOpacity="0.05" />
            <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="currentColor" strokeOpacity="0.05" />
        </svg>
    );
};

export default AreaChart;
