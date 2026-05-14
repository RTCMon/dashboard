import React, { useState } from 'react';
import { X, Mail, Shield, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { api } from '../../lib/api';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/v1/team/invitations', { email, role });
            onSuccess();
            onClose();
            setEmail('');
            setRole('member');
        } catch (err: any) {
            setError(err.message || 'Failed to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-dd-border-light dark:border-dd-border-dark">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Invite Team Member</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-sm text-status-error text-[11px] font-semibold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-colors"
                                placeholder="teammate@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Assign Role</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-colors appearance-none cursor-pointer"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Admins can manage members, apps, and billing.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" className="flex-1" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 size={14} className="animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                'Send Invitation'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
