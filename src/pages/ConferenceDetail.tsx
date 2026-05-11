import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Users, Activity, Clock, Calendar, AlertCircle, Info, ExternalLink, Check } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { api } from '../lib/api';

interface Participant {
    id: string;
    user_id: string;
    display_name: string;
    joined_at: string;
    left_at: string | null;
    status: 'connected' | 'disconnected' | 'reconnecting';
    emos: number;
    browser: string;
    os: string;
    ip_location: string;
}

interface ConferenceDetailData {
    id: string;
    external_id: string;
    subject: string;
    status: string;
    emos: number;
    start_time: string;
    end_time: string | null;
    participants: Participant[];
}

const ConferenceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<ConferenceDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await api.get<ConferenceDetailData>(`/v1/conferences/${id}/participants`);
                setData(response);
            } catch (err) {
                console.error('Failed to fetch conference detail:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleShare = async () => {
        if (!id) return;
        try {
            setIsSharing(true);
            const response = await api.post<{ share_url: string }>(`/v1/conferences/${id}/share`, {});
            await navigator.clipboard.writeText(response.share_url);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to share conference:', err);
        } finally {
            setIsSharing(false);
        }
    };

    if (isLoading) {
        return (
            <Layout title="Conference Detail">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dd"></div>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout title="Conference Detail">
                <div className="text-center py-20">
                    <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Conference Not Found</h2>
                    <p className="text-slate-500 mt-2">The requested session ID does not exist or you don't have access.</p>
                    <Button variant="secondary" className="mt-6" onClick={() => navigate('/conferences')}>Return to list</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Conference Detail">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/conferences')}
                            className="p-2 rounded-full border border-dd-border-light dark:border-dd-border-dark hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-400"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{data.subject || 'Untitled Session'}</h1>
                                <Badge variant={data.status === 'success' ? 'success' : 'warning'}>{data.status}</Badge>
                            </div>
                            <div className="text-xs font-mono text-slate-400 mt-1">ID: {data.external_id || data.id}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="h-9 gap-2 text-xs"
                            onClick={handleShare}
                            disabled={isSharing}
                        >
                            {copied ? <Check size={14} className="text-status-success" /> : <Share2 size={14} />}
                            {copied ? 'Link Copied!' : 'Share Session'}
                        </Button>
                        <Button variant="primary" className="h-9 gap-2 text-xs">
                            <Activity size={14} />
                            Debug Realtime
                        </Button>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="Platform eMOS" value={data.emos.toFixed(2)} icon={Activity} variant={data.emos >= 4 ? 'success' : 'warning'} />
                    <SummaryCard title="Participants" value={data.participants.length.toString()} icon={Users} variant="neutral" />
                    <SummaryCard title="Start Time" value={new Date(data.start_time).toLocaleTimeString()} subValue={new Date(data.start_time).toLocaleDateString()} icon={Calendar} variant="neutral" />
                    <SummaryCard title="Duration" value={data.end_time ? "42m 12s" : "Active"} icon={Clock} variant="neutral" />
                </div>

                {/* Participant List */}
                <section className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Participants</h3>
                            <div className="px-1.5 py-0.5 rounded bg-primary-dd/10 text-primary-dd text-[10px] font-bold">{data.participants.length}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Info size={12} />
                            Live updates enabled
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="text-slate-500 font-bold uppercase tracking-wider">
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold">User / Participant</th>
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold">Status</th>
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold">eMOS</th>
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold">System</th>
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold">Joined</th>
                                    <th className="px-6 py-3 border-b border-dd-border-light dark:border-dd-border-dark font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dd-border-light dark:divide-dd-border-dark">
                                {data.participants.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white capitalize">{p.display_name || 'Anonymous User'}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.user_id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'connected' ? 'bg-status-success animate-pulse' : 'bg-status-neutral'}`}></div>
                                                <span className="capitalize text-slate-600 dark:text-slate-400">{p.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${p.emos >= 4 ? 'text-status-success' : p.emos >= 3 ? 'text-status-warning' : 'text-status-error'}`}>
                                                {p.emos.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5">
                                                <span>{p.browser} on {p.os}</span>
                                                <span className="text-[10px] opacity-70">{p.ip_location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(p.joined_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/sessions/${p.id}`}
                                                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 group-hover:text-primary-dd transition-colors"
                                            >
                                                Deep Dive <ExternalLink size={11} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

const SummaryCard: React.FC<{ title: string, value: string, subValue?: string, icon: any, variant: string }> = ({
    title, value, subValue, icon: Icon, variant
}) => (
    <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-4 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
            <Icon size={14} className="text-slate-300" />
        </div>
        <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${variant === 'success' ? 'text-status-success' : variant === 'warning' ? 'text-status-warning' : 'text-slate-900 dark:text-white'}`}>{value}</span>
            {subValue && <span className="text-[10px] text-slate-400 font-medium">{subValue}</span>}
        </div>
    </div>
);

export default ConferenceDetail;
