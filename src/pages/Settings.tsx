import React, { useState } from 'react';
import { Settings as SettingsIcon, AppWindow, Link as LinkIcon, User } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import AppsTab from '../components/settings/AppsTab';
import ActiveLinksTab from '../components/settings/ActiveLinksTab';
import AccountTab from '../components/settings/AccountTab';

type TabType = 'apps' | 'links' | 'account';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [activeTab, setActiveTab] = useState<TabType>('apps');

    const tabs = [
        { id: 'apps', label: 'Applications', icon: AppWindow, adminOnly: true },
        { id: 'links', label: 'Active Links', icon: LinkIcon, adminOnly: false },
        { id: 'account', label: 'Account', icon: User, adminOnly: false },
    ];

    const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

    // If an admin is on the apps tab and switches to a member, they might get stuck.
    // In this case, we default to 'links' if 'apps' is restricted.
    const currentTab = filteredTabs.find(t => t.id === activeTab) ? activeTab : filteredTabs[0].id;

    return (
        <Layout title="Settings">
            <div className="space-y-6">
                <div className="border-b border-dd-border-light dark:border-dd-border-dark">
                    <div className="flex gap-8">
                        {filteredTabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                                        activeTab === tab.id 
                                        ? 'text-primary-dd' 
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-dd rounded-full animate-in fade-in duration-300"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'apps' && <AppsTab />}
                    {activeTab === 'links' && <ActiveLinksTab />}
                    {activeTab === 'account' && <AccountTab />}
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
