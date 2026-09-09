import React, { useState } from 'react';
import { X, Lock, Phone, User, Sparkles, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USER_1, DEMO_USER_2 } from '../../services/sampleData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, register, switchUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(phone, pin);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        const res = await register(name, phone, pin);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (userId: string) => {
    setLoading(true);
    await switchUser(userId);
    setLoading(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white shadow-lg shadow-purple-500/25 mb-3">
            <span className="text-2xl">❤️</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome to Your Vault' : 'Create Your Memory Space'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Enter your mobile number and security PIN to unlock your vault.'
              : 'Sign up for your own private, isolated digital haven.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-navy-850 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-navy-850 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555 234 5678"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                4-Digit Security PIN
              </label>
              <span className="text-[10px] text-purple-500 font-medium">Secures your private space</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Securing Space...' : mode === 'login' ? 'Unlock My Memories' : 'Create Isolated Account'}
          </button>
        </form>

        {/* Demo Fast Login Box */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick 1-Click Test Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect(DEMO_USER_1.id)}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/80 dark:bg-navy-950/80 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 border border-slate-200 dark:border-slate-800 transition-all text-left group"
            >
              <img
                src={DEMO_USER_1.avatarUrl}
                alt="Elena"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Elena Vance</p>
                <p className="text-[10px] text-purple-500 font-medium">PIN: 1234</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect(DEMO_USER_2.id)}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/80 dark:bg-navy-950/80 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 border border-slate-200 dark:border-slate-800 transition-all text-left group"
            >
              <img
                src={DEMO_USER_2.avatarUrl}
                alt="Marcus"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Marcus Chen</p>
                <p className="text-[10px] text-sky-500 font-medium">PIN: 4321</p>
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-emerald-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Strict User Data Isolation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
