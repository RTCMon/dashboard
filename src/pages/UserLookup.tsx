import React, { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon, History, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import UserCallCard, { UserCall } from '../components/lookup/UserCallCard';
import { api } from '../lib/api';

const UserLookup: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [calls, setCalls] = useState<UserCall[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchUserCalls = useCallback(async (userId: string) => {
        if (!userId.trim()) {
            setCalls([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const data = await api.get<any>(`/v1/users/${encodeURIComponent(userId)}/calls`);
            const finalData = Array.isArray(data) ? data : (data?.data || []);
            setCalls(finalData);
        } catch (err: any) {
            console.error('Failed to fetch user calls:', err);
            // If it's a 404, we just show empty list
            if (err.status === 404) {
                setCalls([]);
            } else {
                setError(err.message || 'An error occurred while searching');
                // Mock data for demo
                setCalls(getMockCalls(userId));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedQuery) {
            fetchUserCalls(debouncedQuery);
        }
    }, [debouncedQuery, fetchUserCalls]);

    return (
        <Layout title="User Lookup">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {/* Search Hero Section */}
                <div className="text-center space-y-4 pt-10">
                    <div className="w-16 h-16 bg-primary-dd/10 text-primary-dd rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <UserIcon size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Participant Search</h1>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Search for any participant by User ID or Display Name to view their connection history and quality metrics across the organization.
                    </p>
                    
                    <div className="max-w-2xl mx-auto pt-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-dd transition-colors" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter User ID or name (e.g. user_123, Alice)..."
                                className="w-full bg-white dark:bg-dd-bg-dark-card border-2 border-dd-border-light dark:border-dd-border-dark rounded-xl pl-12 pr-4 py-4 text-base font-medium focus:outline-none focus:border-primary-dd shadow-sm group-hover:border-dd-border-light/80 dark:group-hover:border-dd-border-dark/80 transition-all"
                            />
                            {isLoading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-primary-dd" size={20} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {hasSearched && !isLoading && (
                        <div className="flex items-center justify-between border-b border-dd-border-light dark:border-dd-border-dark pb-4">
                            <div className="flex items-center gap-2">
                                <History size={16} className="text-slate-400" />
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                                    Call History for "{debouncedQuery}"
                                </h2>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {calls.length} results found
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-md flex items-center gap-3 text-status-error">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-4 rounded-md animate-pulse">
                                    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/3 mb-4"></div>
                                    <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-2/3"></div>
                                </div>
                            ))
                        ) : hasSearched && calls.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 dark:bg-white/5 border border-dashed border-dd-border-light dark:border-dd-border-dark rounded-xl">
                                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No calls found</h3>
                                <p className="text-slate-500 mt-1">We couldn't find any conference history for this user ID.</p>
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 text-sm font-bold text-primary-dd hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            calls.map((call, index) => (
                                <UserCallCard key={index} call={call} />
                            ))
                        )}
                    </div>

                    {!hasSearched && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                            <div className="p-6 border border-dd-border-light dark:border-dd-border-dark rounded-xl space-y-3 bg-slate-50/50 dark:bg-white/5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ArrowRight size={16} className="text-primary-dd" />
                                    Search by ID
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Paste a unique Participant ID (UUID or custom string) to see every connection they've made across all apps.
                                </p>
                            </div>
                            <div className="p-6 border border-dd-border-light dark:border-dd-border-dark rounded-xl space-y-3 bg-slate-50/50 dark:bg-white/5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ArrowRight size={16} className="text-primary-dd" />
                                    Search by Name
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Type a display name to find users. Note: results may include multiple sessions if names are shared.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

// Mock data generator
const getMockCalls = (userId: string): UserCall[] => {
    return [
        {
            conference_id: 'conf_123',
            conference_subject: 'Weekly Team Sync',
            session_id: 'sess_abc123',
            duration_seconds: 1245,
            emos: 4.5,
            timestamp: new Date().toISOString(),
            browser: 'Chrome 124',
            os: 'macOS 14.4',
            country: 'United States',
            network_type: 'Wifi'
        },
        {
            conference_id: 'conf_456',
            conference_subject: 'Project Kickoff',
            session_id: 'sess_def456',
            duration_seconds: 3600,
            emos: 3.8,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            browser: 'Firefox 125',
            os: 'Windows 11',
            country: 'Germany',
            network_type: 'Ethernet'
        },
        {
            conference_id: 'conf_789',
            conference_subject: 'Client Presentation',
            session_id: 'sess_ghi789',
            duration_seconds: 1800,
            emos: 4.2,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            browser: 'Safari 17.4',
            os: 'iOS 17.4',
            country: 'Japan',
            network_type: 'Cellular (5G)'
        }
    ];
};

export default UserLookup;
