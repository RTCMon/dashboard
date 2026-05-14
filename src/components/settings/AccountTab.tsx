import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Save, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Button from '../ui/Button';

const AccountTab: React.FC = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await api.post('/auth/me', { name }); // Assuming POST/PATCH /auth/me for profile updates
            setSuccessMessage('Profile updated successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await api.post('/auth/me/password', { 
                current_password: currentPassword,
                new_password: newPassword
            });
            setSuccessMessage('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* General Profile */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <User size={16} className="text-primary-dd" />
                        Profile Settings
                    </h3>
                    {successMessage && !error && (
                        <span className="text-[10px] font-bold text-status-success uppercase flex items-center gap-1 animate-in fade-in">
                            <Check size={12} /> {successMessage}
                        </span>
                    )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5 p-6 bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-sm">
                    {error && (
                        <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-sm text-status-error text-[11px] font-semibold">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Email Address (Read-only)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input
                                    type="email"
                                    readOnly
                                    value={email}
                                    className="w-full bg-slate-100 dark:bg-slate-900/20 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" size="sm" className="gap-2 px-6" disabled={isSaving}>
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Profile
                        </Button>
                    </div>
                </form>
            </section>

            {/* Password Change */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Lock size={16} className="text-primary-dd" />
                    Security
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-5 p-6 border border-dd-border-light dark:border-dd-border-dark rounded-sm">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Current Password</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary-dd transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="secondary" size="sm" className="gap-2 px-6" disabled={isSaving}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AccountTab;
