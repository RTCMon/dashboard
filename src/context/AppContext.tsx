import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface App {
    id: string;
    name: string;
    key?: string;
    created_at?: string;
}

interface AppContextType {
    apps: App[];
    selectedApp: App | null;
    isLoading: boolean;
    setSelectedAppId: (id: string) => void;
    refreshApps: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apps, setApps] = useState<App[]>([]);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshApps = async () => {
        try {
            setIsLoading(true);
            const data = await api.get<App[]>('/v1/apps');
            setApps(data);

            // Default select the first app if none selected or current no longer exists
            if (data.length > 0) {
                const storedAppId = localStorage.getItem('selectedAppId');
                const found = data.find(a => a.id === storedAppId) || data[0];
                setSelectedApp(found);
            } else {
                setSelectedApp(null);
            }
        } catch (err) {
            console.error('Failed to fetch apps:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshApps();
    }, []);

    const setSelectedAppId = (id: string) => {
        const found = apps.find(a => a.id === id);
        if (found) {
            setSelectedApp(found);
            localStorage.setItem('selectedAppId', id);
        }
    };

    return (
        <AppContext.Provider value={{ apps, selectedApp, isLoading, setSelectedAppId, refreshApps }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
