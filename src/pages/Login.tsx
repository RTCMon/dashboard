import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--color-dd-bg-light] dark:bg-[--color-dd-bg-dark-main] p-4 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-[--color-dd-bg-dark-card] border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-[--color-primary-dd] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[--color-primary-dd]/20">
                            <Activity size={24} />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">RTCMon</h1>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-[--color-status-error]/10 border border-[--color-status-error]/20 rounded-[--radius-sm] flex items-center gap-3 text-[--color-status-error] text-xs font-semibold">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
                                <a href="#" className="text-[10px] font-bold text-[--color-primary-dd] hover:underline uppercase tracking-wider">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-11"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-[--color-primary-dd] hover:underline uppercase tracking-wider">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
