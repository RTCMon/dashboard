import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

interface Observation {
    id: string;
    timestamp: string;
    type: 'observation';
    severity: 'info' | 'warning' | 'critical';
    message: string;
}

interface ObservationsPanelProps {
    observations: Observation[];
    onJumpTo: (timestamp: string) => void;
}

const ObservationsPanel: React.FC<ObservationsPanelProps> = ({ observations, onJumpTo }) => {
    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Observations</h3>
                    <div className="px-1.5 py-0.5 rounded bg-status-warning/10 text-status-warning text-[10px] font-bold">{observations.length}</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {observations.length > 0 ? (
                    observations.map(obs => (
                        <div
                            key={obs.id}
                            onClick={() => onJumpTo(obs.timestamp)}
                            className="p-3 rounded-md border border-dd-border-light dark:border-dd-border-dark hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                            <div className="flex items-start gap-3">
                                {obs.severity === 'critical' ? (
                                    <AlertCircle size={16} className="text-status-error shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle size={16} className="text-status-warning shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-bold uppercase ${obs.severity === 'critical' ? 'text-status-error' : 'text-status-warning'
                                            }`}>
                                            {obs.severity} Detected
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-mono">
                                            {new Date(obs.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {obs.message}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-primary-dd uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        Jump to Timeline <ArrowUpRight size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-50 grayscale">
                        <CheckCircle size={32} className="text-status-success mb-3" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">No issues detected<br /><span className="text-[10px] font-medium lowercase">Session health is optimal</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObservationsPanel;
