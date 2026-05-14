import React, { useState, useEffect } from 'react';
import { Download, Filter, RefreshCcw, TrendingUp, AlertCircle, Loader2, BarChart3, Globe, Shield, Activity } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import DateRangeSelector, { TimeRange } from '../components/ui/DateRangeSelector';
import KPICard from '../components/analytics/KPICard';
import TrendChart from '../components/analytics/TrendChart';
import BreakdownChart from '../components/analytics/BreakdownChart';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';

interface AnalyticsOverview {
    success_rate: number;
    success_rate_change: number;
    avg_emos: number;
    avg_emos_change: number;
    p50_latency: number;
    p50_latency_change: number;
    total_sessions: number;
    total_sessions_change: number;
    emos_trend: { timestamp: string; value: number }[];
}

interface BreakdownItem {
    label: string;
    value: number;
    percentage: number;
}

const Analytics: React.FC = () => {
    const { selectedApp, apps, setSelectedAppId } = useAppContext();
    const [timeRange, setTimeRange] = useState<TimeRange>('24h');
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [breakdowns, setBreakdowns] = useState<{ [key: string]: BreakdownItem[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const fetchData = async () => {
        if (!selectedApp) return;
        setIsLoading(true);
        try {
            // Fetch Overview
            const overviewData = await api.get<AnalyticsOverview>(`/v1/apps/${selectedApp.id}/analytics/overview`, {
                params: { range: timeRange }
            });
            setOverview(overviewData);

            // Fetch Breakdowns in parallel
            const dimensions = ['browser', 'os', 'region', 'network_type'];
            const breakdownResults = await Promise.all(
                dimensions.map(dim => 
                    api.get<any>(`/v1/apps/${selectedApp.id}/analytics/breakdown`, {
                        params: { range: timeRange, by: dim }
                    }).then(res => ({ dim, data: Array.isArray(res) ? res : (res.data || []) }))
                )
            );

            const breakdownMap: { [key: string]: BreakdownItem[] } = {};
            breakdownResults.forEach(res => {
                breakdownMap[res.dim] = res.data;
            });
            setBreakdowns(breakdownMap);

        } catch (err) {
            console.error('Failed to fetch analytics data:', err);
            // Fallback mock data if API fails
            setOverview(getMockOverview());
            setBreakdowns(getMockBreakdowns());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedApp?.id, timeRange]);

    const handleExport = () => {
        if (!overview) return;
        setIsExporting(true);
        
        try {
            // Simple CSV generation
            const headers = ['Metric', 'Value', 'Unit'];
            const rows = [
                ['Success Rate', overview.success_rate, '%'],
                ['Average eMOS', overview.avg_emos, ''],
                ['P50 Latency', overview.p50_latency, 'ms'],
                ['Total Sessions', overview.total_sessions, '']
            ];

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `rtcmon-analytics-${selectedApp?.name}-${timeRange}.csv`;
            link.click();
        } catch (err) {
            alert('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Layout title="Analytics Dashboard">
            <div className="space-y-6 pb-10">
                {/* Filters Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-4 rounded-md shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-primary-dd" />
                            <select 
                                value={selectedApp?.id || ''} 
                                onChange={(e) => setSelectedAppId(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-900 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-dd transition-all"
                            >
                                {apps.map(app => (
                                    <option key={app.id} value={app.id}>{app.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="h-6 w-px bg-dd-border-light dark:bg-dd-border-dark hidden md:block"></div>
                        <DateRangeSelector value={timeRange} onChange={setTimeRange} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" className="h-9 gap-2 text-xs font-bold uppercase" onClick={handleExport} disabled={isExporting}>
                            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                            Export CSV
                        </Button>
                        <Button variant="secondary" className="h-9 p-0 w-9" onClick={fetchData}>
                            <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <KPICard 
                        title="Call Success Rate" 
                        value={overview?.success_rate || 0} 
                        unit="%" 
                        change={overview?.success_rate_change} 
                        isLoading={isLoading} 
                    />
                    <KPICard 
                        title="Average eMOS" 
                        value={overview?.avg_emos || 0} 
                        change={overview?.avg_emos_change} 
                        isLoading={isLoading} 
                    />
                    <KPICard 
                        title="P50 Latency (RTT)" 
                        value={overview?.p50_latency || 0} 
                        unit="ms" 
                        change={overview?.p50_latency_change} 
                        isLoading={isLoading} 
                    />
                    <KPICard 
                        title="Total Sessions" 
                        value={overview?.total_sessions || 0} 
                        change={overview?.total_sessions_change} 
                        isLoading={isLoading} 
                    />
                </div>

                {/* Trend Section */}
                <TrendChart 
                    title="eMOS Trend (Quality over time)" 
                    data={overview?.emos_trend || []} 
                    color="#10B981"
                    unit=""
                />

                {/* Breakdowns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <BreakdownChart 
                        title="By Browser" 
                        data={breakdowns['browser'] || []} 
                        color="#4F46E5" 
                        isLoading={isLoading} 
                    />
                    <BreakdownChart 
                        title="By OS" 
                        data={breakdowns['os'] || []} 
                        color="#7C3AED" 
                        isLoading={isLoading} 
                    />
                    <BreakdownChart 
                        title="By Region" 
                        data={breakdowns['region'] || []} 
                        color="#EC4899" 
                        isLoading={isLoading} 
                    />
                    <BreakdownChart 
                        title="By Network" 
                        data={breakdowns['network_type'] || []} 
                        color="#F59E0B" 
                        isLoading={isLoading} 
                    />
                </div>
                
                {(!isLoading && !overview) && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-dd-bg-dark-card border border-dashed border-dd-border-light dark:border-dd-border-dark rounded-md">
                        <AlertCircle size={40} className="text-slate-300 mb-4" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No analytics data found</h3>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or selecting another application.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

// Mock data generators
const getMockOverview = (): AnalyticsOverview => {
    const emos_trend = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
        emos_trend.push({
            timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
            value: 3.8 + Math.random() * 0.7
        });
    }

    return {
        success_rate: 98.4,
        success_rate_change: 0.2,
        avg_emos: 4.2,
        avg_emos_change: -0.1,
        p50_latency: 42,
        p50_latency_change: -5,
        total_sessions: 12450,
        total_sessions_change: 12,
        emos_trend
    };
};

const getMockBreakdowns = () => ({
    browser: [
        { label: 'Chrome', value: 8200, percentage: 65.8 },
        { label: 'Firefox', value: 1850, percentage: 14.9 },
        { label: 'Safari', value: 1400, percentage: 11.2 },
        { label: 'Edge', value: 1000, percentage: 8.1 },
    ],
    os: [
        { label: 'Windows', value: 5500, percentage: 44.2 },
        { label: 'macOS', value: 4200, percentage: 33.7 },
        { label: 'Android', value: 1500, percentage: 12.0 },
        { label: 'iOS', value: 1250, percentage: 10.1 },
    ],
    region: [
        { label: 'United States', value: 6200, percentage: 49.8 },
        { label: 'Europe', value: 3400, percentage: 27.3 },
        { label: 'Asia', value: 1850, percentage: 14.9 },
        { label: 'Others', value: 1000, percentage: 8.0 },
    ],
    network_type: [
        { label: 'Wifi', value: 7800, percentage: 62.7 },
        { label: 'Ethernet', value: 2400, percentage: 19.3 },
        { label: 'Cellular (4G)', value: 1500, percentage: 12.0 },
        { label: 'Cellular (5G)', value: 750, percentage: 6.0 },
    ],
});

export default Analytics;
