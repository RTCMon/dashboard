import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const { apps, selectedApp, setSelectedAppId } = useAppContext();

    return (
        <header className="h-12 bg-white dark:bg-dd-bg-dark-main border-b border-dd-border-light dark:border-dd-border-dark flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 lg:hidden"
                    >
                        <Menu size={18} />
                    </button>
                )}

                <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
                    <div className="h-4 w-[1px] bg-dd-border-light dark:bg-dd-border-dark mx-1 hidden sm:block"></div>

                    {/* App Selector */}
                    <div className="relative group">
                        <select
                            value={selectedApp?.id || ''}
                            onChange={(e) => setSelectedAppId(e.target.value)}
                            className="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm px-2 pr-6 py-0.5 text-[11px] font-bold text-primary-dd focus:outline-none focus:border-primary-dd cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                        >
                            {apps.map(app => (
                                <option key={app.id} value={app.id}>{app.name}</option>
                            ))}
                            {apps.length === 0 && <option value="" disabled>No apps found</option>}
                        </select>
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Menu size={8} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative hidden md:block">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search metrics..."
                        className="bg-slate-50 dark:bg-slate-900/50 border border-dd-border-light dark:border-dd-border-dark rounded-sm pl-8 pr-3 py-1 text-[11px] focus:outline-none focus:border-primary-dd w-48 lg:w-64 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <Bell size={15} />
                    </button>
                    <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <HelpCircle size={15} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
