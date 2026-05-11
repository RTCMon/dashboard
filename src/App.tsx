import { Activity, Users, CheckCircle, Clock, Zap, Search, Bell, Settings, LayoutDashboard, Database, HelpCircle } from 'lucide-react';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import StatCard from './components/ui/StatCard';
import MetricChartSkeleton from './components/ui/MetricChartSkeleton';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-[--color-dd-bg-light] dark:bg-[--color-dd-bg-dark-main] text-slate-700 dark:text-slate-300 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-100 dark:bg-[--color-dd-bg-dark-sidebar] border-r border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-[--color-dd-border-light] dark:border-[--color-dd-border-dark]">
          <div className="w-8 h-8 bg-[--color-primary-dd] rounded-md flex items-center justify-center text-white font-bold">RM</div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">RTCMon</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={Activity} label="Conferences" />
          <NavItem icon={Database} label="Logs" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] space-y-4">
          <Button variant="secondary" size="sm" onClick={toggleTheme} className="w-full justify-start">
            {theme === 'dark' ? <Zap size={14} /> : <Clock size={14} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="text-[10px]">
              <div className="font-bold text-slate-900 dark:text-white">Admin User</div>
              <div className="text-slate-500">Pro Organization</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-12 bg-white dark:bg-[--color-dd-bg-dark-main] border-b border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
            <Badge variant="primary">v2.1.0-beta</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search metrics..."
                className="bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-[--color-primary-dd] w-64"
              />
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Bell size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <HelpCircle size={16} />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Global eMOS"
              value="4.25"
              trend={+2.4}
              icon={Activity}
              subValue="Target: > 4.0"
            />
            <StatCard
              title="Active Conferences"
              value="1,284"
              trend={-1.2}
              icon={Users}
              subValue="Peak today: 1,512"
            />
            <StatCard
              title="Success Rate"
              value="99.2%"
              trend={+0.1}
              icon={CheckCircle}
              subValue="Last 24 hours"
            />
            <StatCard
              title="Avg Setup Time"
              value="420ms"
              trend={-5.4}
              icon={Clock}
              subValue="P95: 1.2s"
            />
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Traffic Volume</h2>
                <div className="flex gap-2">
                  <Badge variant="success">Healthy</Badge>
                  <Button variant="ghost" size="sm" className="h-6">Last 60m</Button>
                </div>
              </div>
              <MetricChartSkeleton title="Total Bitrate (Ingest)" unit="Mbps" />
              <div className="grid grid-cols-2 gap-4">
                <MetricChartSkeleton title="Packet Loss" unit="%" />
                <MetricChartSkeleton title="RTT / Latency" unit="ms" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</h2>
              <div className="bg-white dark:bg-[--color-dd-bg-dark-card] border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] p-4 shadow-sm space-y-3">
                <Button variant="primary" className="w-full">Create New App</Button>
                <Button variant="secondary" className="w-full">Invite Team Member</Button>
                <Button variant="danger" className="w-full">View Alerts (12)</Button>
              </div>

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">Recent Events</h2>
              <div className="space-y-2">
                <EventItem label="App 'Video-Conf-Prod' scale-up" time="2m ago" />
                <EventItem label="Spike in packet loss (US-East)" time="14m ago" variant="error" />
                <EventItem label="New API version deployed" time="45m ago" variant="success" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 px-3 py-1.5 rounded-[--radius-sm] text-xs font-medium transition-colors ${active
      ? 'bg-[--color-primary-dd]/10 text-[--color-primary-dd] dark:bg-[--color-primary-dd]/20'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
      }`}>
      <Icon size={14} className={active ? 'text-[--color-primary-dd]' : 'text-slate-400'} />
      {label}
    </a>
  );
}

function EventItem({ label, time, variant = 'neutral' }: { label: string, time: string, variant?: any }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-[--radius-sm] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${variant === 'success' ? 'bg-[--color-status-success]' :
        variant === 'error' ? 'bg-[--color-status-error]' : 'bg-slate-300 dark:bg-slate-600'
        }`}></div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</div>
        <div className="text-[9px] text-slate-400 mt-0.5">{time}</div>
      </div>
    </div>
  );
}

export default App;
