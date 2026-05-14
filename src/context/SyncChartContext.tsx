import React, { createContext, useContext, useState } from 'react';

interface SyncChartContextType {
    hoverIndex: number | null;
    setHoverIndex: (index: number | null) => void;
}

const SyncChartContext = createContext<SyncChartContextType | undefined>(undefined);

export const SyncChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    return (
        <SyncChartContext.Provider value={{ hoverIndex, setHoverIndex }}>
            {children}
        </SyncChartContext.Provider>
    );
};

export const useSyncChart = () => {
    const context = useContext(SyncChartContext);
    if (context === undefined) {
        throw new Error('useSyncChart must be used within a SyncChartProvider');
    }
    return context;
};
