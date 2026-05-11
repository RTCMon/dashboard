import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Users, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import { api } from '../lib/api';
import { useAppContext } from '../context/AppContext';

interface Conference {
    id: string;
    external_id: string;
    app_id: string;
    subject: string;
    participants_count: number;
    start_time: string;
    end_time: string | null;
    duration_seconds: number | null;
    status: 'success' | 'degraded' | 'failed';
    emos: number;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

const Conferences: React.FC = () => {
    const { selectedApp } = useAppContext();
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const limit = 10;

    const fetchConferences = useCallback(async () => {
        if (!selectedApp) return;
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search,
                status: statusFilter,
            });
            const response = await api.get<PaginatedResponse<Conference>>(`/v1/apps/${selectedApp.id}/conferences?${query.toString()}`);
            setConferences(response.data);
            setTotal(response.total);
        } catch (err) {
            console.error('Failed to fetch conferences:', err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedApp, page, search, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchConferences();
        }, 300); // Simple debounce
        return () => clearTimeout(timer);
    }, [fetchConferences]);

    const totalPages = Math.ceil(total / limit);

    return (
        <Layout title="Conference Explorer">
            <div className="space-y-4">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-3 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
                    <div className="relative w-full md:w-80">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID or Subject..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-dd transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-primary-dd transition-all flex-1 md:flex-initial"
                        >
                            <option value="">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="degraded">Degraded</option>
                            <option value="failed">Failed</option>
                        </select>
                        <button className="p-2 rounded border border-dd-border-light dark:border-dd-border-dark hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <Filter size={14} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 border-b border-dd-border-light dark:border-dd-border-dark text-slate-500 font-bold uppercase tracking-wider">
                                    <th className="px-4 py-3 font-bold">Conference ID</th>
                                    <th className="px-4 py-3 font-bold">Subject</th>
                                    <th className="px-4 py-3 font-bold"><div className="flex items-center gap-1"><Users size={12} /> Participants</div></th>
                                    <th className="px-4 py-3 font-bold"><div className="flex items-center gap-1"><Calendar size={12} /> Start Time</div></th>
                                    <th className="px-4 py-3 font-bold"><div className="flex items-center gap-1"><Clock size={12} /> Duration</div></th>
                                    <th className="px-4 py-3 font-bold">Status</th>
                                    <th className="px-4 py-3 font-bold">eMOS</th>
                                    <th className="px-4 py-3 font-bold text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dd-border-light dark:divide-dd-border-dark">
                                {isLoading ? (
                                    Array.from({ length: limit }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={8} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full"></div></td>
                                        </tr>
                                    ))
                                ) : conferences.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-400 italic">No conferences found.</td>
                                    </tr>
                                ) : (
                                    conferences.map((conf) => (
                                        <tr key={conf.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 font-mono text-primary-dd">{conf.external_id || conf.id.slice(0, 8)}</td>
                                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{conf.subject || 'Untitled Session'}</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{conf.participants_count}</td>
                                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(conf.start_time).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-slate-500">{conf.duration_seconds ? `${Math.floor(conf.duration_seconds / 60)}m ${conf.duration_seconds % 60}s` : 'Active'}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={conf.status === 'success' ? 'success' : conf.status === 'degraded' ? 'warning' : 'error'}>
                                                    {conf.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${conf.emos >= 4 ? 'bg-status-success' : conf.emos >= 3 ? 'bg-status-warning' : 'bg-status-error'}`}></div>
                                                    <span className="font-bold">{conf.emos.toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right pr-6">
                                                <Link
                                                    to={`/conferences/${conf.id}`}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 group-hover:text-primary-dd transition-colors"
                                                >
                                                    View Details <ExternalLink size={10} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border-t border-dd-border-light dark:border-dd-border-dark flex items-center justify-between">
                        <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                            Showing <span className="text-slate-700 dark:text-slate-300 font-bold">{(page - 1) * limit + 1} - {Math.min(page * limit, total)}</span> of <span className="text-slate-700 dark:text-slate-300 font-bold">{total}</span> conferences
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page === 1 || isLoading}
                                onClick={() => setPage(p => p - 1)}
                                className="p-1 rounded border border-dd-border-light dark:border-dd-border-dark disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 transition-all text-slate-500"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">{page} / {totalPages || 1}</div>
                            <button
                                disabled={page >= totalPages || isLoading}
                                onClick={() => setPage(p => p + 1)}
                                className="p-1 rounded border border-dd-border-light dark:border-dd-border-dark disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 transition-all text-slate-500"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Conferences;
