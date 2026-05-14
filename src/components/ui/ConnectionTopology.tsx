import React from 'react';
import { Monitor, Server, Shield, Zap } from 'lucide-react';

interface TopologyProps {
    localCandidateType: string;
    remoteCandidateType: string;
    protocol: string;
    relayProtocol?: string;
}

const ConnectionTopology: React.FC<TopologyProps> = ({
    localCandidateType,
    remoteCandidateType,
    protocol,
    relayProtocol
}) => {
    const isRelayed = localCandidateType === 'relay' || remoteCandidateType === 'relay';

    return (
        <div className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">Connection Topology</h3>

            <div className="relative flex items-center justify-between max-w-2xl mx-auto py-10">
                {/* Background Connecting Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2 z-0"></div>
                {isRelayed && (
                    <div className="absolute top-1/2 left-[25%] right-[25%] h-0.5 bg-primary-dd/20 -translate-y-1/2 z-0"></div>
                )}

                {/* Client Node */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-dd-border-dark flex items-center justify-center text-slate-400 group hover:border-primary-dd transition-all">
                        <Monitor size={24} className="group-hover:text-primary-dd" />
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold uppercase text-slate-900 dark:text-white">Local Client</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{localCandidateType}</div>
                    </div>
                </div>

                {/* Relay Node (Optional) */}
                {isRelayed && (
                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-dd/10 border-2 border-primary-dd flex items-center justify-center text-primary-dd shadow-sm shadow-primary-dd/20">
                            <Shield size={20} />
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold uppercase text-primary-dd">TURN Relay</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{relayProtocol || 'udp'}</div>
                        </div>
                    </div>
                )}

                {/* Server/SFU Node */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-dd-border-dark flex items-center justify-center text-slate-400 group hover:border-status-success transition-all">
                        <Server size={24} className="group-hover:text-status-success" />
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold uppercase text-slate-900 dark:text-white">Media Server</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">SFU (Global)</div>
                    </div>
                </div>

                {/* Overlay Indicators */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${isRelayed ? 'bg-primary-dd/10 border-primary-dd text-primary-dd' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-dd-border-dark text-slate-400'}`}>
                        {protocol}
                    </div>
                    <div className="flex items-center gap-1 group">
                        <Zap size={10} className="text-status-success" />
                        <span className="text-[9px] font-bold text-status-success opacity-0 group-hover:opacity-100 transition-opacity">E2E Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-dd-border-light dark:border-dd-border-dark pt-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Candidate (L)</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 truncate">{localCandidateType}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Transport</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 truncate">{protocol}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Encryption</span>
                    <span className="text-[10px] font-mono font-bold text-status-success truncate">DTLS-SRTP</span>
                </div>
            </div>
        </div>
    );
};

export default ConnectionTopology;
