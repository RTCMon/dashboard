import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import Conferences from './pages/Conferences';
import ConferenceDetail from './pages/ConferenceDetail';
import SessionDetail from './pages/SessionDetail';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import UserLookup from './pages/UserLookup';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/conferences" element={<Conferences />} />
      <Route path="/conferences/:id" element={<ConferenceDetail />} />
      <Route path="/sessions/:id" element={<SessionDetail />} />
      {/* Add other dashboard routes here as they are implemented */}
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/lookup" element={<UserLookup />} />
      <Route path="/team" element={<Team />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center border-2 border-dashed border-dd-border-light dark:border-dd-border-dark rounded-sm">
      <div className="text-center p-8">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">{label}</div>
        <div className="text-slate-500 text-sm italic">Component implementation pending...</div>
      </div>
    </div>
  );
}

export default App;
