import React, { useState, useEffect } from 'react';
import { Activity, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import MetricChartSkeleton from '../components/ui/MetricChartSkeleton';
import Button from '../components/ui/Button';
import AreaChart from '../components/ui/AreaChart';
import UI_Badge from '../components/ui/Badge';
import { api } from '../lib/api';
import { useAppContext } from '../context/AppContext';

interface AnalyticsOverview {
    emos: number;
    active_conferences: number;
    success_rate: number;
    setup_time_p95: number;
    trends: {
        emos: number;
        active_conferences: number;
        success_rate: number;
        setup_time: number;
    };
    chart_data?: { label: string, value: number }[];
}

const Overview: React.FC = () => {
    const { selectedApp } = useAppContext();
    const [stats, setStats] = useState<AnalyticsOverview | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOverview = async (appId: string) => {
        try {
            setIsLoading(true);
            const data = await api.get<AnalyticsOverview>(`/v1/apps/${appId}/analytics/overview`);
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setStats(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedApp) {
            fetchOverview(selectedApp.id);
        }
    }, [selectedApp]);

    const mockChartData = [
        { label: '00:00', value: 30 }, { label: '02:00', value: 45 }, { label: '04:00', value: 25 },
        { label: '06:00', value: 60 }, { label: '08:00', value: 85 }, { label: '10:00', value: 70 },
        { label: '12:00', value: 95 }, { label: '14:00', value: 80 }, { label: '16:00', value: 110 },
        { label: '18:00', value: 130 }, { label: '20:00', value: 105 }, { label: '22:00', value: 90 },
    ];

    return (
        <Layout title="Dashboard Overview">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Overview</h2>
                        <p className="text-sm text-slate-500">Real-time health metrics for {selectedApp?.name || 'your application'}.</p>
                    </div>
                    {isLoading && <div className="flex items-center gap-2 text-[10px] font-bold text-primary-dd uppercase animate-pulse transition-opacity">
                        <div className="w-1.5 h-1.5 bg-primary-dd rounded-full"></div>
                        Syncing...
                    </div>}
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading && !stats ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md animate-pulse"></div>
                        ))
                    ) : (
                        <>
                            <StatCard
                                title="Global eMOS"
                                value={stats ? stats.emos.toFixed(2) : "4.2"}
                                trend={stats?.trends.emos || +0.4}
                                icon={Activity}
                                subValue="Target: > 4.0"
                            />
                            <StatCard
                                title="Active Conferences"
                                value={stats ? stats.active_conferences.toLocaleString() : "1,204"}
                                trend={stats?.trends.active_conferences || +12}
                                icon={Users}
                                subValue="Live sessions"
                            />
                            <StatCard
                                title="Success Rate"
                                value={stats ? `${(stats.success_rate * 100).toFixed(1)}%` : "98.5%"}
                                trend={stats?.trends.success_rate || -0.2}
                                icon={CheckCircle}
                                subValue="Last 60 minutes"
                            />
                            <StatCard
                                title="Setup Time (P95)"
                                value={stats ? `${stats.setup_time_p95}ms` : "340ms"}
                                trend={stats?.trends.setup_time || -5}
                                icon={Clock}
                                subValue="Connection latency"
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <section className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-4 shadow-sm min-h-[300px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Conference Volume</h3>
                                <div className="flex items-center gap-2">
                                    <UI_Badge variant="success">Live</UI_Badge>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-[180px] mt-2 group relative">
                                <AreaChart data={stats?.chart_data || mockChartData} />
                                <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {(stats?.chart_data || mockChartData).filter((_, i) => i % 2 === 0).map((d, i) => (
                                        <span key={i} className="text-[9px] text-slate-400 font-medium">{d.label}</span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <MetricChartSkeleton title="Packet Loss" unit="%" />
                            <MetricChartSkeleton title="RTT / Latency" unit="ms" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-5 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="primary" className="w-full justify-between group">
                                    <span>Create New App</span>
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </Button>
                                <Button variant="secondary" className="w-full justify-start gap-2">
                                    <Users size={14} />
                                    <span>Invite Team</span>
                                </Button>
                            </div>
                        </section>

                        <section className="bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-md p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Platform Health</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-status-success animate-pulse"></div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">All systems operational</span>
                            </div>
                            <div className="space-y-3 text-[11px]">
                                <div className="flex justify-between text-slate-500">
                                    <span>Ingest Edge-US</span>
                                    <span className="text-status-success">Healthy</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Ingest Edge-EU</span>
                                    <span className="text-status-success">Healthy</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Query API</span>
                                    <span className="text-status-success">Healthy</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Overview;
