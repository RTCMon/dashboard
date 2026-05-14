import React from 'react';
import { Activity, Shield, Zap, Info, AlertCircle, AlertTriangle, Eye } from 'lucide-react';

interface TimelineEvent {
    id: string;
    timestamp: string;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    details?: any;
}

interface EventTimelineProps {
    events: TimelineEvent[];
    onSelectEvent: (event: TimelineEvent) => void;
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events, onSelectEvent }) => {
    const getIcon = (type: string, severity: string) => {
        if (severity === 'critical') return <AlertCircle size={14} className="text-status-error" />;
        if (severity === 'warning') return <AlertTriangle size={14} className="text-status-warning" />;

        switch (type.toLowerCase()) {
            case 'signaling': return <Shield size={14} className="text-primary-dd" />;
            case 'ice': return <Zap size={14} className="text-status-warning" />;
            case 'track': return <Activity size={14} className="text-status-success" />;
            default: return <Info size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm flex flex-col h-full">
            <div className="px-6 py-4 border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Connection Lifecycle & Events</h3>
                <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 text-[10px] font-bold">{events.length} Events</div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px] p-6">
                <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[7px] before:w-0.5 before:-translate-x-1/2 before:bg-slate-100 dark:before:bg-white/5">
                    {events.map((event) => (
                        <div key={event.id} className="relative pl-8 pb-8 group last:pb-0">
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-dd-bg-dark-card -translate-x-1/2 z-10 transition-transform group-hover:scale-125 ${event.severity === 'critical' ? 'border-status-error' :
                                event.severity === 'warning' ? 'border-status-warning' :
                                    'border-slate-300 dark:border-slate-600'
                                }`}></div>

                            <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onSelectEvent(event)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {getIcon(event.type, event.severity)}
                                            <span className={`text-[10px] font-bold uppercase tracking-tight ${event.severity === 'critical' ? 'text-status-error' :
                                                event.severity === 'warning' ? 'text-status-warning' :
                                                    'text-slate-500'
                                                }`}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                    {event.details && (
                                        <button className="text-[10px] font-bold text-primary-dd flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                                            View SDP <Eye size={10} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                    {event.message}
                                </div>
                                {event.details && (
                                    <div className="mt-2 text-[10px] font-mono bg-slate-50 dark:bg-white/5 p-2 rounded border border-dd-border-light dark:border-dd-border-dark text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap group-hover:whitespace-normal transition-all">
                                        {typeof event.details === 'string' ? event.details : JSON.stringify(event.details)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventTimeline;
