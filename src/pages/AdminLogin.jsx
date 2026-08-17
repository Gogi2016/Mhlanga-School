import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/Supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <header className="border-b border-white/10 px-5 sm:px-8 py-5 flex items-center justify-between">
        <div className="font-display text-xl sm:text-2xl tracking-tight">
          MHLANGA <span className="ochre">SS</span>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5 border border-white/15 hover:border-[#00A3AD] hover:text-[#00A3AD] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </header>

      <main className="flex items-center justify-center px-5 py-16 sm:py-24">
        <div className="w-full max-w-md glass p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#00A3AD] flex items-center justify-center">
              <Lock size={22} className="text-[#121416]" />
            </span>
            <h1 className="font-display text-2xl tracking-tight text-[#F4F4F4]">Admin Login</h1>
            <p className="text-sm text-[#F4F4F4]/50 mt-2">Mhlanga Senior Secondary School</p>
          </div>

          {error && (
            <div className="mb-5 border border-[#D27D2D]/40 bg-[#D27D2D]/[0.06] px-4 py-3">
              <p className="flex items-start gap-2 text-sm text-[#F4F4F4]/80">
                <AlertCircle size={16} className="text-[#D27D2D] shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#F4F4F4]/40" />
                <input
                  type="email"
                  required
                  className="line-input"
                  style={{ paddingLeft: '1.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mhlangass.co.za"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#F4F4F4]/40" />
                <input
                  type="password"
                  required
                  className="line-input"
                  style={{ paddingLeft: '1.75rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-btn font-display text-sm tracking-wide w-full py-4 bg-[#00A3AD] text-[#121416] disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}