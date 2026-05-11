import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Activity, Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        org_name: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register(formData);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create your account</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Start monitoring your WebRTC apps</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-[--color-status-error]/10 border border-[--color-status-error]/20 rounded-[--radius-sm] flex items-center gap-3 text-[--color-status-error] text-xs font-semibold">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Organization Name</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="org_name"
                                    required
                                    value={formData.org_name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="Acme Corp"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] rounded-[--radius-sm] pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-primary-dd] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-11"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-[--color-dd-border-light] dark:border-[--color-dd-border-dark] text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[--color-primary-dd] hover:underline uppercase tracking-wider">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
