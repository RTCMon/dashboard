import React, { useState } from 'react';
import { X, Copy, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface KeyRevealModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    appName: string;
}

const KeyRevealModal: React.FC<KeyRevealModalProps> = ({ isOpen, onClose, apiKey, appName }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-dd-border-light dark:border-dd-border-dark">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Backend SDK Key</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-sm flex gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-tight">One-time Reveal</p>
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                                This secret key for <span className="font-bold">{appName}</span> will only be shown once. 
                                Please copy and store it securely. You cannot view it again later.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Secret Key</label>
                        <div className="relative group">
                            <input
                                type={isVisible ? 'text' : 'password'}
                                readOnly
                                value={apiKey}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-3 pr-20 py-3 font-mono text-sm focus:outline-none focus:border-primary-dd transition-all"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                    onClick={() => setIsVisible(!isVisible)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    title={isVisible ? 'Hide' : 'Show'}
                                >
                                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={16} className="text-status-success" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button variant="primary" className="w-full" onClick={onClose}>
                            I have saved this key
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyRevealModal;
