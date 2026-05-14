import React, { useState, useEffect } from 'react';
import { ExternalLink, Trash2, Link as LinkIcon, User, Calendar, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

interface ShareToken {
    token: string;
    conference_id: string;
    conference_subject: string;
    created_by: string;
    created_by_name: string;
    created_at: string;
    view_count: number;
    expires_at: string | null;
}

const ActiveLinksTab: React.FC = () => {
    const { user } = useAuth();
    const [tokens, setTokens] = useState<ShareToken[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTokens = async () => {
        try {
            setIsLoading(true);
            const data = await api.get<any>('/v1/share-tokens');
            console.log('API Response - Share Tokens:', data);
            
            const finalTokens = Array.isArray(data) ? data : (data?.data || []);
            setTokens(finalTokens);
        } catch (err) {
            console.error('Failed to fetch share tokens:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const handleRevoke = async (token: string) => {
        if (!confirm('Revoking this link will immediately disable access for anyone using it. Continue?')) return;
        try {
            await api.delete(`/v1/share-tokens/${token}`);
            setTokens(tokens.filter(t => t.token !== token));
        } catch (err) {
            alert('Failed to revoke link');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <LinkIcon size={16} className="text-primary-dd" />
                        Shareable Links
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Manage active share links for conferences. Links provide secure, authenticated access to specific session metrics.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 border-b border-dd-border-light dark:border-dd-border-dark">
                                <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Conference</th>
                                <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Created By</th>
                                <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Stats</th>
                                <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dd-border-light dark:divide-dd-border-dark">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-6 h-16">
                                            <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : tokens.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-xs">No active share links found.</td>
                                </tr>
                            ) : (
                                tokens.map((token) => (
                                    <tr key={token?.token || Math.random()} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {token?.conference_subject || 'Untitled Conference'}
                                                    <Badge variant="neutral" className="font-mono">{(token?.token || '').slice(0, 8)}...</Badge>
                                                </div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Calendar size={10} /> Created on {token?.created_at ? new Date(token.created_at).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                    {token?.created_by_name?.[0] || 'U'}
                                                </div>
                                                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {token?.created_by_name || 'Unknown'}
                                                    {token?.created_by === user?.id && <span className="ml-1 text-[9px] text-primary-dd uppercase">(You)</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-[10px] font-extrabold uppercase tracking-tighter text-slate-400">Views</div>
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                                        <Eye size={12} className="text-slate-400" />
                                                        {token?.view_count || 0}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[10px] font-extrabold uppercase tracking-tighter text-slate-400">Expires</div>
                                                    <div className="text-xs font-bold text-slate-500">
                                                        {token?.expires_at ? new Date(token.expires_at).toLocaleDateString() : 'Never'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {token?.token && (
                                                    <a 
                                                        href={`/share/${token.token}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-slate-400 hover:text-primary-dd transition-colors"
                                                        title="Open link"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                                <button 
                                                    onClick={() => handleRevoke(token?.token)}
                                                    className="p-1.5 text-slate-400 hover:text-status-error transition-colors"
                                                    title="Revoke link"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActiveLinksTab;
