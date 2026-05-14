import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Trash2, Shield, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import InviteMemberModal from '../components/team/InviteMemberModal';

interface TeamMember {
    id: string;
    email: string;
    name: string;
    role: string;
    joined_at: string;
}

interface Invitation {
    token: string;
    email: string;
    role: string;
    invited_by: string;
    expires_at: string;
    created_at: string;
}

const Team: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [members, setMembers] = useState<TeamMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('Fetching team data...');
            
            const [membersRes, invitationsRes] = await Promise.all([
                api.get<any>('/v1/team/members'),
                api.get<any>('/v1/team/invitations').catch(err => {
                    console.warn('Invitations fetch failed (possibly not admin):', err);
                    return { data: [] };
                })
            ]);
            
            console.log('API Response - Members:', membersRes);
            console.log('API Response - Invitations:', invitationsRes);

            const finalMembers = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
            const finalInvitations = Array.isArray(invitationsRes) ? invitationsRes : (invitationsRes?.data || []);
            
            setMembers(finalMembers);
            setInvitations(finalInvitations);
        } catch (err: any) {
            console.error('Failed to fetch team data:', err);
            setError(err.message || 'Failed to load team data. Please check your connection or permissions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            // Check breakdown again: it says PATCH /v1/team/members/:userId/role
            await api.patch(`/v1/team/members/${userId}/role`, { role: newRole });
            setMembers(members.map(m => m.id === userId ? { ...m, role: newRole } : m));
        } catch (err) {
            alert('Failed to update role');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await api.delete(`/v1/team/members/${userId}`);
            setMembers(members.filter(m => m.id !== userId));
        } catch (err) {
            alert('Failed to remove member');
        }
    };

    const handleRevokeInvitation = async (token: string) => {
        if (!confirm('Are you sure you want to revoke this invitation?')) return;
        try {
            await api.delete(`/v1/team/invitations/${token}`);
            setInvitations(invitations.filter(i => i.token !== token));
        } catch (err) {
            alert('Failed to revoke invitation');
        }
    };

    return (
        <Layout title="Team Management">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Team Members</h2>
                        <p className="text-sm text-slate-500">Manage your organization's users and their access levels.</p>
                    </div>
                    {isAdmin && (
                        <Button
                            variant="primary"
                            onClick={() => setIsInviteModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <UserPlus size={16} />
                            <span>Invite Member</span>
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-sm flex items-center gap-3 text-status-error">
                        <AlertCircle size={20} />
                        <div className="text-sm font-semibold">{error}</div>
                    </div>
                )}

                {/* Members Table */}
                <section className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 border-b border-dd-border-light dark:border-dd-border-dark">
                                    <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Name / Email</th>
                                    <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Role</th>
                                    <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Joined</th>
                                    <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dd-border-light dark:divide-dd-border-dark">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-6 py-8 h-16 bg-slate-50/50 dark:bg-white/5">
                                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/3"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : members.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                                            {error ? 'Could not load members.' : 'No members found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member?.id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-dd/10 text-primary-dd flex items-center justify-center text-xs font-bold">
                                                        {member?.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {member?.name || 'Unknown'} 
                                                            {member?.id === user?.id && <span className="ml-1 text-[9px] text-primary-dd uppercase font-black">(You)</span>}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{member?.email || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isAdmin && member?.id !== user?.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={member?.role || 'member'}
                                                            onChange={(e) => handleUpdateRole(member?.id, e.target.value)}
                                                            className="bg-slate-50 dark:bg-white/5 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-dd cursor-pointer"
                                                        >
                                                            <option value="member">Member</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <Badge variant={member?.role === 'admin' ? 'primary' : 'neutral'}>
                                                        {member?.role || 'member'}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {member?.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isAdmin && member?.id !== user?.id && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member?.id)}
                                                        className="p-1.5 text-slate-400 hover:text-status-error hover:bg-status-error/10 rounded-sm transition-all"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Invitations Section */}
                {(isAdmin || (invitations && invitations.length > 0)) && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pending Invitations</h3>
                            {invitations && invitations.length > 0 && <span className="bg-primary-dd text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{invitations.length}</span>}
                        </div>

                        <section className="bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-sm shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-white/5 border-b border-dd-border-light dark:border-dd-border-dark">
                                            <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Email</th>
                                            <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Role</th>
                                            <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Expires</th>
                                            <th className="px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dd-border-light dark:divide-dd-border-dark">
                                        {!invitations || invitations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic text-xs">No pending invitations.</td>
                                            </tr>
                                        ) : (
                                            invitations.map((invite) => (
                                                <tr key={invite?.token || Math.random()} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-slate-400" />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{invite?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={invite?.role === 'admin' ? 'primary' : 'neutral'}>
                                                            {invite?.role || 'member'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500">
                                                        {invite?.expires_at ? new Date(invite.expires_at).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => handleRevokeInvitation(invite?.token)}
                                                                className="text-[10px] font-black text-status-error hover:underline uppercase tracking-widest"
                                                            >
                                                                Revoke
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={fetchData}
            />
        </Layout>
    );
};

export default Team;
