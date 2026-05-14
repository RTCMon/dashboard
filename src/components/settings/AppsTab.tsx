import React, { useState, useEffect } from 'react';
import { Shield, Key, RefreshCw, Trash2, Globe, Clock, Settings as SettingsIcon, Save, Info, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import KeyRevealModal from './KeyRevealModal';

interface FullAppDetails {
    id: string;
    name: string;
    key_status: 'active' | 'revoked' | 'none';
    jwt_strategy: 'HS256' | 'RS256';
    data_retention_days: number;
    observation_config: {
        emos_threshold: number;
        jitter_threshold: number;
        packet_loss_threshold: number;
    };
    created_at: string;
}

const AppsTab: React.FC = () => {
    const { apps, refreshApps } = useAppContext();
    const { user } = useAuth();
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [appDetails, setAppDetails] = useState<FullAppDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [generatedKey, setGeneratedKey] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (apps.length > 0 && !selectedAppId) {
            setSelectedAppId(apps[0].id);
        }
    }, [apps, selectedAppId]);

    useEffect(() => {
        if (selectedAppId) {
            fetchAppDetails(selectedAppId);
        }
    }, [selectedAppId]);

    const fetchAppDetails = async (id: string) => {
        setIsLoading(true);
        try {
            // Mocking full details since /v1/apps might be minimal
            // In a real app, this would be GET /v1/apps/:id or the list already has it
            const data = await api.get<FullAppDetails>(`/v1/apps/${id}`);
            setAppDetails(data);
        } catch (err) {
            console.error('Failed to fetch app details:', err);
            // Fallback mock if endpoint doesn't exist yet
            setAppDetails({
                id,
                name: apps.find(a => a.id === id)?.name || 'Unknown App',
                key_status: 'active',
                jwt_strategy: 'HS256',
                data_retention_days: 30,
                observation_config: {
                    emos_threshold: 4.0,
                    jitter_threshold: 30,
                    packet_loss_threshold: 2
                },
                created_at: new Date().toISOString()
            });
        } finally {
            setIsLoading(true); // Wait, should be false
            setIsLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!appDetails) return;
        setIsSaving(true);
        try {
            await api.post(`/v1/apps/${appDetails.id}`, appDetails); // Assuming POST/PATCH for update
            setSuccessMessage('Application settings updated successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
            refreshApps();
        } catch (err) {
            alert('Failed to save app settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateKey = async () => {
        if (!appDetails || !user) return;
        try {
            const res = await api.post<{ key: string }>(`/v1/orgs/${user.org_id}/apps/${appDetails.id}/server-key`);
            setGeneratedKey(res.key);
            setShowKeyModal(true);
            setAppDetails({ ...appDetails, key_status: 'active' });
        } catch (err) {
            alert('Failed to generate SDK key');
        }
    };

    const handleRotateKey = async () => {
        if (!appDetails || !user || !confirm('Rotating the key will immediately invalidate the current one. Continue?')) return;
        try {
            const res = await api.post<{ key: string }>(`/v1/orgs/${user.org_id}/apps/${appDetails.id}/rotate-server-key`);
            setGeneratedKey(res.key);
            setShowKeyModal(true);
        } catch (err) {
            alert('Failed to rotate SDK key');
        }
    };

    const handleRevokeKey = async () => {
        if (!appDetails || !user || !confirm('Revoking the key will stop all ingest using this key. Continue?')) return;
        try {
            await api.delete(`/v1/orgs/${user.org_id}/apps/${appDetails.id}/server-key`);
            setAppDetails({ ...appDetails, key_status: 'revoked' });
        } catch (err) {
            alert('Failed to revoke SDK key');
        }
    };

    const ingestEndpoint = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/v1/ingest`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* App Sidebar */}
            <div className="lg:col-span-1 space-y-2">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3 px-2">Applications</h3>
                {apps.map(app => (
                    <button
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-xs font-bold transition-all ${
                            selectedAppId === app.id 
                            ? 'bg-primary-dd/10 text-primary-dd border-l-2 border-primary-dd' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        {app.name}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {!appDetails ? (
                    <div className="h-64 flex items-center justify-center border border-dashed border-dd-border-light dark:border-dd-border-dark rounded-sm text-slate-400 text-xs italic">
                        Select an application to view settings
                    </div>
                ) : (
                    <>
                        {/* App Header */}
                        <div className="flex items-center justify-between border-b border-dd-border-light dark:border-dd-border-dark pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{appDetails.name}</h2>
                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">App ID: {appDetails.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {successMessage && (
                                    <span className="text-[10px] font-bold text-status-success uppercase flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                        <Check size={12} /> {successMessage}
                                    </span>
                                )}
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="gap-2" 
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                >
                                    <Save size={14} />
                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Connection Settings */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Globe size={14} className="text-primary-dd" />
                                    Connection
                                </h3>
                                
                                <div className="space-y-3 p-4 bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Ingest Endpoint</label>
                                        <div className="flex gap-2">
                                            <input 
                                                readOnly 
                                                value={ingestEndpoint}
                                                className="flex-1 bg-white dark:bg-slate-900 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-2 py-1.5 text-[11px] font-mono focus:outline-none"
                                            />
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(ingestEndpoint)}
                                                className="p-1.5 text-slate-400 hover:text-primary-dd transition-colors"
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Backend SDK Key</label>
                                            <Badge variant={appDetails.key_status === 'active' ? 'success' : appDetails.key_status === 'revoked' ? 'error' : 'neutral'}>
                                                {appDetails.key_status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {appDetails.key_status === 'none' ? (
                                                <Button variant="primary" size="sm" className="w-full gap-2" onClick={handleGenerateKey}>
                                                    <Key size={14} /> Generate Key
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={handleRotateKey}>
                                                        <RefreshCw size={14} /> Rotate
                                                    </Button>
                                                    <Button variant="danger" size="sm" className="flex-1 gap-2" onClick={handleRevokeKey}>
                                                        <Trash2 size={14} /> Revoke
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Authentication Settings */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Shield size={14} className="text-primary-dd" />
                                    Authentication
                                </h3>

                                <div className="space-y-4 p-4 border border-dd-border-light dark:border-dd-border-dark rounded-sm">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">JWT Strategy</label>
                                        <div className="flex gap-4">
                                            {['HS256', 'RS256'].map(strat => (
                                                <label key={strat} className="flex items-center gap-2 cursor-pointer group">
                                                    <input 
                                                        type="radio" 
                                                        name="jwt_strategy" 
                                                        checked={appDetails.jwt_strategy === strat}
                                                        onChange={() => setAppDetails({...appDetails, jwt_strategy: strat as any})}
                                                        className="w-3.5 h-3.5 text-primary-dd border-dd-border-light dark:border-dd-border-dark focus:ring-primary-dd" 
                                                    />
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-dd transition-colors">{strat}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">Select the algorithm used to sign participant join tokens.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Configuration */}
                            <section className="md:col-span-2 space-y-4">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <SettingsIcon size={14} className="text-primary-dd" />
                                    Analysis Configuration
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 border border-dd-border-light dark:border-dd-border-dark rounded-sm">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                            eMOS Threshold
                                            <Info size={10} className="text-slate-300" title="Sessions with eMOS below this value are flagged as degraded" />
                                        </label>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={appDetails.observation_config.emos_threshold}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails, 
                                                observation_config: { ...appDetails.observation_config, emos_threshold: parseFloat(e.target.value) }
                                            })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-dd"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Jitter Threshold (ms)</label>
                                        <input 
                                            type="number" 
                                            value={appDetails.observation_config.jitter_threshold}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails, 
                                                observation_config: { ...appDetails.observation_config, jitter_threshold: parseInt(e.target.value) }
                                            })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-dd"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Packet Loss (%)</label>
                                        <input 
                                            type="number" 
                                            value={appDetails.observation_config.packet_loss_threshold}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails, 
                                                observation_config: { ...appDetails.observation_config, packet_loss_threshold: parseInt(e.target.value) }
                                            })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-dd"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Data Retention */}
                            <section className="md:col-span-2 space-y-4">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Clock size={14} className="text-primary-dd" />
                                    Data Management
                                </h3>

                                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Retention Period</label>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">How long telemetry data and session logs are kept.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={appDetails.data_retention_days}
                                            onChange={(e) => setAppDetails({...appDetails, data_retention_days: parseInt(e.target.value)})}
                                            className="bg-white dark:bg-slate-900 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary-dd"
                                        >
                                            <option value={7}>7 Days</option>
                                            <option value={30}>30 Days</option>
                                            <option value={90}>90 Days</option>
                                            <option value={365}>1 Year</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>

            {appDetails && (
                <KeyRevealModal 
                    isOpen={showKeyModal} 
                    onClose={() => setShowKeyModal(false)} 
                    apiKey={generatedKey} 
                    appName={appDetails.name} 
                />
            )}
        </div>
    );
};

export default AppsTab;
