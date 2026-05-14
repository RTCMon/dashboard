import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge';

export interface UserCall {
    conference_id: string;
    conference_subject: string;
    session_id: string;
    duration_seconds: number;
    emos: number;
    timestamp: string;
    browser: string;
    os: string;
    country: string;
    network_type: string;
}

interface UserCallCardProps {
    call: UserCall;
}

const UserCallCard: React.FC<UserCallCardProps> = ({ call }) => {
    const navigate = useNavigate();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getEmosVariant = (emos: number) => {
        if (emos >= 4.0) return 'success';
        if (emos >= 3.0) return 'warning';
        return 'error';
    };

    return (
        <div 
            onClick={() => navigate(`/sessions/${call.session_id}`)}
            className="group bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark p-4 rounded-md shadow-sm hover:border-primary-dd/50 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-primary-dd transition-all"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                            {call.conference_subject || 'Untitled Conference'}
                        </h3>
                        <Badge variant={getEmosVariant(call.emos)} className="shrink-0">
                            {call.emos.toFixed(1)} eMOS
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-500 uppercase tracking-tight">
                        <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400" />
                            {new Date(call.timestamp).toLocaleDateString()} {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {formatDuration(call.duration_seconds)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Globe size={12} className="text-slate-400" />
                            {call.country || 'Unknown'} • {call.network_type || 'Ethernet'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Platform</span>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {call.browser} on {call.os}
                        </span>
                    </div>
                    <div className="p-2 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-primary-dd group-hover:bg-primary-dd/10 transition-all">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-dd-border-light dark:border-dd-border-dark flex items-center justify-between">
                <div className="text-[9px] font-mono text-slate-400 truncate max-w-[200px]">
                    Session: {call.session_id}
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/conferences/${call.conference_id}`);
                    }}
                    className="text-[10px] font-bold text-primary-dd hover:underline flex items-center gap-1"
                >
                    View Conference <ExternalLink size={10} />
                </button>
            </div>
        </div>
    );
};

export default UserCallCard;
