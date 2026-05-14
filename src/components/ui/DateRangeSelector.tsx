import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type TimeRange = '1h' | '24h' | '7d' | '30d' | '90d' | 'custom';

interface DateRangeSelectorProps {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => {
    const options: { id: TimeRange; label: string }[] = [
        { id: '1h', label: 'Last Hour' },
        { id: '24h', label: 'Last 24 Hours' },
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
        { id: '90d', label: 'Last Quarter' },
    ];

    return (
        <div className="flex items-center bg-white dark:bg-dd-bg-dark-card border border-dd-border-light dark:border-dd-border-dark rounded-md p-1 shadow-sm">
            <div className="px-2.5 py-1 text-slate-400 border-r border-dd-border-light dark:border-dd-border-dark mr-1">
                <Calendar size={14} />
            </div>
            <div className="flex gap-0.5">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-sm transition-all ${
                            value === option.id
                                ? 'bg-primary-dd text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <div className="ml-1 pl-1 border-l border-dd-border-light dark:border-dd-border-dark">
                <button className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-primary-dd transition-colors flex items-center gap-1">
                    Custom
                    <ChevronDown size={10} />
                </button>
            </div>
        </div>
    );
};

export default DateRangeSelector;
