import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSyncChart } from '../../context/SyncChartContext';

interface DataPoint {
    timestamp: string;
    value: number;
    ewmaValue?: number;
}

interface EventMarker {
    timestamp: string;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
}

interface DetailedMetricChartProps {
    title: string;
    unit: string;
    data: DataPoint[];
    events?: EventMarker[];
    showEwma?: boolean;
    color?: string;
    height?: number;
}

const DetailedMetricChart: React.FC<DetailedMetricChartProps> = ({
    title,
    unit,
    data,
    events = [],
    showEwma = false,
    color = '#4F46E5', // Indigo-600
    height = 180
}) => {
    const { hoverIndex, setHoverIndex } = useSyncChart();
    const containerRef = useRef<HTMLDivElement>(null);
    const [localHoverIndex, setLocalHoverIndex] = useState<number | null>(null);

    // Sync local hover index with global context
    useEffect(() => {
        setLocalHoverIndex(hoverIndex);
    }, [hoverIndex]);

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data;
    }, [data]);

    const { max, min } = useMemo(() => {
        if (chartData.length === 0) return { max: 0, min: 0 };
        const values = chartData.flatMap(d => [d.value, showEwma && d.ewmaValue !== undefined ? d.ewmaValue : d.value]);
        return {
            max: Math.max(...values, 1),
            min: Math.min(...values, 0)
        };
    }, [chartData, showEwma]);

    const padding = { top: 20, right: 10, bottom: 20, left: 10 };
    const chartHeight = height - padding.top - padding.bottom;
    const width = 1000; // Fixed viewbox width
    const step = width / Math.max(chartData.length - 1, 1);

    const getPoints = (isEwma: boolean) => {
        return chartData.map((d, i) => {
            const val = isEwma && d.ewmaValue !== undefined ? d.ewmaValue : d.value;
            const x = i * step;
            const y = padding.top + chartHeight - ((val - min) / (max - min)) * chartHeight;
            return { x, y };
        });
    };

    const points = useMemo(() => getPoints(false), [chartData, max, min, chartHeight]);
    const ewmaPoints = useMemo(() => getPoints(true), [chartData, max, min, chartHeight, showEwma]);

    const eventMarkers = useMemo(() => {
        if (chartData.length < 2 || events.length === 0) return [];
        const startTime = new Date(chartData[0].timestamp).getTime();
        const endTime = new Date(chartData[chartData.length - 1].timestamp).getTime();
        const duration = endTime - startTime;

        return events.map(event => {
            const time = new Date(event.timestamp).getTime();
            if (time < startTime || time > endTime) return null;
            const x = ((time - startTime) / duration) * width;
            return { ...event, x };
        }).filter((e): e is (EventMarker & { x: number }) => e !== null);
    }, [chartData, events, width]);

    const linePath = useMemo(() => {
        if (points.length < 2) return '';
        return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    }, [points]);

    const ewmaLinePath = useMemo(() => {
        if (ewmaPoints.length < 2) return '';
        return ewmaPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    }, [ewmaPoints]);

    const areaPath = useMemo(() => {
        if (points.length < 2) return '';
        const lastPoint = points[points.length - 1];
        return `${linePath} L ${lastPoint.x} ${height - padding.bottom} L 0 ${height - padding.bottom} Z`;
    }, [linePath, points, height, padding.bottom]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!containerRef.current || chartData.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const index = Math.round((x / rect.width) * (chartData.length - 1));
        const safeIndex = Math.max(0, Math.min(index, chartData.length - 1));
        setHoverIndex(safeIndex);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    const hoverData = localHoverIndex !== null ? chartData[localHoverIndex] : null;
    const hoverPoint = localHoverIndex !== null ? points[localHoverIndex] : null;
    const hoverEwmaPoint = localHoverIndex !== null ? ewmaPoints[localHoverIndex] : null;

    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md overflow-hidden shadow-sm flex flex-col h-full">
            <div className="px-4 py-2 border-b border-dd-border-light dark:border-dd-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                {hoverData && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200">
                                {hoverData.value.toLocaleString()} {unit}
                            </span>
                        </div>
                        {showEwma && hoverData.ewmaValue !== undefined && (
                            <div className="flex items-center gap-1.5 opacity-60">
                                <div className="w-1.5 h-1.5 rounded-full border border-current" style={{ color: color }}></div>
                                <span className="text-[10px] font-mono font-bold text-slate-500">
                                    EWMA: {hoverData.ewmaValue.toLocaleString()} {unit}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div ref={containerRef} className="relative flex-1 min-h-[140px] group cursor-crosshair">
                {chartData.length > 0 ? (
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="0" y1={padding.top} x2={width} y2={padding.top} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 2" />
                        <line x1="0" y1={padding.top + chartHeight} x2={width} y2={padding.top + chartHeight} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 2" />

                        {/* Area */}
                        <path d={areaPath} fill={`url(#gradient-${title})`} />

                        {/* Line */}
                        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                        {/* EWMA Line (dashed) */}
                        {showEwma && ewmaPoints.length > 0 && (
                            <path d={ewmaLinePath} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                        )}

                        {/* Event Markers */}
                        {eventMarkers.map((event, i) => (
                            <g key={i} className="group/marker">
                                <line
                                    x1={event.x}
                                    y1={padding.top}
                                    x2={event.x}
                                    y2={padding.top + chartHeight}
                                    stroke={
                                        event.severity === 'critical' ? '#EF4444' :
                                            event.severity === 'warning' ? '#F59E0B' :
                                                '#64748B'
                                    }
                                    strokeWidth="1.5"
                                    strokeDasharray="2 2"
                                    opacity="0.5"
                                />
                                <circle
                                    cx={event.x}
                                    cy={padding.top}
                                    r="3"
                                    fill={
                                        event.severity === 'critical' ? '#EF4444' :
                                            event.severity === 'warning' ? '#F59E0B' :
                                                '#64748B'
                                    }
                                />
                                <title>{`${event.type}: ${event.message}`}</title>
                            </g>
                        ))}

                        {/* Synchronized Crosshair */}
                        {localHoverIndex !== null && hoverPoint && (
                            <g>
                                <line
                                    x1={hoverPoint.x}
                                    y1={0}
                                    x2={hoverPoint.x}
                                    y2={height}
                                    stroke="currentColor"
                                    strokeOpacity="0.2"
                                    strokeWidth="1"
                                />
                                <circle cx={hoverPoint.x} cy={hoverPoint.y} r="3" fill={color} stroke="white" strokeWidth="1.5" />
                                {showEwma && hoverEwmaPoint && (
                                    <circle cx={hoverEwmaPoint.x} cy={hoverEwmaPoint.y} r="2.5" fill="none" stroke={color} strokeWidth="1" />
                                )}
                            </g>
                        )}
                    </svg>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-medium italic">
                        No data available for this range
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailedMetricChart;
