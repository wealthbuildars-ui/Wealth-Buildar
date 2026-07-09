import React, { useState } from 'react';
import { Mail, User, Key, HelpCircle, ArrowRight, Wallet, Shield } from 'lucide-react';

interface AuthProps {
  login: (email: string) => { success: boolean; message: string };
  signup: (email: string, name: string, referredBy?: string) => { success: boolean; message: string };
}

export default function Auth({ login, signup }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    if (isLogin) {
      const res = login(email);
      if (!res.success) {
        setError(res.message);
      } else {
        setSuccess(res.message);
      }
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      const res = signup(email, name, referredBy);
      if (!res.success) {
        setError(res.message);
      } else {
        setSuccess(res.message);
      }
    }
  };

  // Quick login helper
  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    const res = login(demoEmail);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccess(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-brand-green">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 bg-clip-text text-transparent">
              Wealth Builder
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Learn • Track • Scale</p>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
          {isLogin ? 'Sign in to your platform account' : 'Register your premium account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none underline"
          >
            {isLogin ? 'create a new profile instead' : 'log in to an existing profile'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm transition-all"
                    placeholder="Chizaram W. Amajor"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="referredBy" className="block text-sm font-medium text-slate-300 flex items-center gap-1">
                  Referral Code <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="referredBy"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm transition-all"
                    placeholder="ADMN777"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                {isLogin ? 'Sign In To Account' : 'Register Premium Membership'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              Developer/Tester Sandbox Seeding
            </h3>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('user@gmail.com')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-950 hover:border-emerald-500/30 transition-all text-left text-xs"
              >
                <div>
                  <p className="font-bold text-slate-200">John Doe (Approved User)</p>
                  <p className="text-slate-500">Includes active commissions & saved balances</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded">user@gmail.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('wealthbuilder@gmail.com')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:bg-slate-950 hover:border-emerald-500/30 transition-all text-left text-xs"
              >
                <div>
                  <p className="font-bold text-slate-200">Platform Administrator</p>
                  <p className="text-slate-500">View payment audits, settings, ticketing desks</p>
                </div>
                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded">wealthbuilder@gmail.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
