import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import Conferences from './pages/Conferences';
import ConferenceDetail from './pages/ConferenceDetail';
import SessionDetail from './pages/SessionDetail';
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
      <Route path="/logs" element={<Layout title="Logs"><Placeholder label="Logs" /></Layout>} />
      <Route path="/team" element={<Layout title="Team"><Placeholder label="Team" /></Layout>} />
      <Route path="/settings" element={<Layout title="Settings"><Placeholder label="Settings" /></Layout>} />
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
