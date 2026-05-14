import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertCircle, RefreshCcw, FileJson } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DetailedMetricChart from '../components/ui/DetailedMetricChart';
import ConnectionTopology from '../components/ui/ConnectionTopology';
import EventTimeline from '../components/ui/EventTimeline';
import ObservationsPanel from '../components/ui/ObservationsPanel';
import { api } from '../lib/api';
import { SyncChartProvider, useSyncChart } from '../context/SyncChartContext';

interface ConnectionStat {
    timestamp: string;
    bitrate_in: number;
    bitrate_out: number;
    packet_loss: number;
    jitter: number;
    rtt: number;
    emos: number;
    concealment_ratio: number;
    ewma_bitrate_in?: number;
    ewma_bitrate_out?: number;
    ewma_packet_loss?: number;
    ewma_jitter?: number;
    ewma_rtt?: number;
    ewma_emos?: number;
    ewma_concealment_ratio?: number;
}

interface TimelineEvent {
    id: string;
    timestamp: string;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    details?: any;
}

interface ConnectionInfo {
    id: string;
    user_id: string;
    display_name: string;
    conference_id: string;
    status: string;
    browser: string;
    os: string;
    protocol: string;
    local_candidate_type: string;
    remote_candidate_type: string;
    stats: ConnectionStat[];
    events: TimelineEvent[];
}

const SessionDetail: React.FC = () => {
    return (
        <SyncChartProvider>
            <SessionDetailContent />
        </SyncChartProvider>
    );
};

const SessionDetailContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setHoverIndex } = useSyncChart();
    const [data, setData] = useState<ConnectionInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEwma, setShowEwma] = useState(false);
    const [timeRange, setTimeRange] = useState('60m');
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

    const fetchStats = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const stats = await api.get<any>(`/v1/connections/${id}/stats`, { params: { range: timeRange } });
            const events = await api.get<TimelineEvent[]>(`/v1/connections/${id}/events`);

            setData({
                ...stats,
                events: events || []
            });
        } catch (err) {
            console.error('Failed to fetch connection data:', err);
            setData(getMockData(id || 'unknown'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [id, timeRange]);

    const handleJumpTo = (timestamp: string) => {
        if (!data || data.stats.length === 0) return;
        const time = new Date(timestamp).getTime();

        // Find closest stat index
        let closestIndex = 0;
        let minDiff = Infinity;

        data.stats.forEach((s, i) => {
            const diff = Math.abs(new Date(s.timestamp).getTime() - time);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        });

        setHoverIndex(closestIndex);

        // Find the event in timeline and scroll to it (simplified for now)
        const element = document.getElementById(`event-${timestamp}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isLoading && !data) {
        return (
            <Layout title="Session Detail">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dd"></div>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout title="Session Detail">
                <div className="text-center py-20">
                    <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Session Not Found</h2>
                    <p className="text-slate-500 mt-2">The requested connection ID does not exist or has no stats.</p>
                    <Button variant="secondary" className="mt-6" onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </Layout>
        );
    }

    const observations = data.events.filter(e => e.type.toLowerCase() === 'observation') as any[];

    return (
        <Layout title="Session Debugger">
            <div className="space-y-6 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full border border-dd-border-light dark:border-dd-border-dark hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-400"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {data.display_name || 'Anonymous'}
                                </h1>
                                <Badge variant={data.status === 'connected' ? 'success' : 'neutral'}>{data.status}</Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                                <span>Session: {data.id}</span>
                                <span className="opacity-30">|</span>
                                <span>Platform: {data.browser} on {data.os}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-1">
                            {['15m', '60m', '24h', 'Custom'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-all ${timeRange === range
                                        ? 'bg-primary-dd text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant={showEwma ? 'primary' : 'secondary'}
                            className="h-8 gap-1.5 text-[10px] font-bold uppercase"
                            onClick={() => setShowEwma(!showEwma)}
                        >
                            <Activity size={12} />
                            {showEwma ? 'Raw + EWMA' : 'Raw Data'}
                        </Button>
                        <Button variant="secondary" className="h-8 p-0 w-8" onClick={fetchStats}>
                            <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        {/* Topology & Observations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ConnectionTopology
                                localCandidateType={data.local_candidate_type}
                                remoteCandidateType={data.remote_candidate_type}
                                protocol={data.protocol}
                            />
                            <ObservationsPanel observations={observations} onJumpTo={handleJumpTo} />
                        </div>

                        {/* Chart Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DetailedMetricChart
                                title="Bitrate Inbound"
                                unit="kbps"
                                data={data.stats.map(s => ({ timestamp: s.timestamp, value: s.bitrate_in, ewmaValue: s.ewma_bitrate_in }))}
                                events={data.events}
                                showEwma={showEwma}
                                color="#4F46E5"
                            />
                            <DetailedMetricChart
                                title="Bitrate Outbound"
                                unit="kbps"
                                data={data.stats.map(s => ({ timestamp: s.timestamp, value: s.bitrate_out, ewmaValue: s.ewma_bitrate_out }))}
                                events={data.events}
                                showEwma={showEwma}
                                color="#7C3AED"
                            />
                            <DetailedMetricChart
                                title="User Experience (eMOS)"
                                unit=""
                                data={data.stats.map(s => ({ timestamp: s.timestamp, value: s.emos, ewmaValue: s.ewma_emos }))}
                                events={data.events}
                                showEwma={showEwma}
                                color="#10B981"
                            />
                            <DetailedMetricChart
                                title="Round Trip Time (RTT)"
                                unit="ms"
                                data={data.stats.map(s => ({ timestamp: s.timestamp, value: s.rtt, ewmaValue: s.ewma_rtt }))}
                                events={data.events}
                                showEwma={showEwma}
                                color="#F59E0B"
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-1">
                        <EventTimeline
                            events={data.events}
                            onSelectEvent={(e) => setSelectedEvent(e)}
                        />
                    </div>
                </div>

                {/* SDP Inspection Section */}
                {selectedEvent && selectedEvent.details && (
                    <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-4 border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between bg-slate-900">
                            <div className="flex items-center gap-3">
                                <FileJson size={18} className="text-slate-400" />
                                <h3 className="text-sm font-bold text-white">SDP / Event Inspector</h3>
                                <Badge variant="neutral" className="bg-white/10 text-white border-transparent">{selectedEvent.type}</Badge>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white transition-colors">
                                <Activity size={18} />
                            </button>
                        </div>
                        <div className="p-6 bg-slate-950">
                            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-4 bg-black/40 rounded border border-white/5 whitespace-pre-wrap leading-relaxed">
                                {typeof selectedEvent.details === 'string' ? selectedEvent.details : JSON.stringify(selectedEvent.details, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

// Mock data generator for fallback
const getMockData = (id: string): ConnectionInfo => {
    const stats: ConnectionStat[] = [];
    const now = new Date();
    for (let i = 60; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        const baseVal = 1000 + Math.sin(i / 5) * 500 + Math.random() * 200;
        stats.push({
            timestamp: time.toISOString(),
            bitrate_in: baseVal,
            bitrate_out: baseVal * 0.8,
            packet_loss: Math.random() < 0.1 ? Math.random() * 2 : 0,
            jitter: 5 + Math.random() * 10,
            rtt: 40 + Math.random() * 20,
            emos: 4.0 + Math.random() * 0.5,
            concealment_ratio: Math.random() < 0.05 ? Math.random() * 5 : 0,
            ewma_bitrate_in: baseVal * 0.95,
            ewma_bitrate_out: baseVal * 0.75,
            ewma_emos: 4.2
        });
    }

    const events: TimelineEvent[] = [
        { id: '1', timestamp: new Date(now.getTime() - 55 * 60000).toISOString(), type: 'Signaling', severity: 'info', message: 'Offer sent to remote peer', details: 'v=0\r\no=- 4531828132483120108 2 IN IP4 127.0.0.1...' },
        { id: '2', timestamp: new Date(now.getTime() - 54 * 60000).toISOString(), type: 'Signaling', severity: 'info', message: 'Answer received from remote peer', details: 'v=0\r\no=- 4239842...' },
        { id: '3', timestamp: new Date(now.getTime() - 53 * 60000).toISOString(), type: 'ICE', severity: 'warning', message: 'ICE Gathering: relay-udp candidate selected', details: { type: 'relay', protocol: 'udp' } },
        { id: '4', timestamp: new Date(now.getTime() - 50 * 60000).toISOString(), type: 'Track', severity: 'info', message: 'Audio track enabled' },
        { id: '5', timestamp: new Date(now.getTime() - 48 * 60000).toISOString(), type: 'Track', severity: 'info', message: 'Video track enabled' },
        { id: '6', timestamp: new Date(now.getTime() - 30 * 60000).toISOString(), type: 'Observation', severity: 'warning', message: 'Transient high packet loss detected (1.5%)' },
        { id: '7', timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), type: 'Observation', severity: 'critical', message: 'Severe bitrate congestion on inbound stream' },
    ];

    return {
        id,
        user_id: 'user_123',
        display_name: 'Fitra (Lead Dev)',
        conference_id: 'conf_abc',
        status: 'connected',
        browser: 'Chrome 124',
        os: 'macOS 14.4',
        protocol: 'UDP',
        local_candidate_type: 'relay',
        remote_candidate_type: 'srflx',
        stats,
        events
    };
};

export default SessionDetail;
