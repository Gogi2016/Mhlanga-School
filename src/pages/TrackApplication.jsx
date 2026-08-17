import React, { useState } from 'react';
import { Search, FileText, Calendar, GraduationCap, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';
import SubPageHeader from '@/components/mhlanga/SubPageHeader';
import useReveal from '@/components/mhlanga/useReveal';
import { supabase } from '@/lib/Supabase';

const STREAM_LABELS = {
  A1: 'A1 · Mathematics & Physical Sciences',
  A2: 'A2 · Agricultural Sciences',
  A3: 'A3 · Humanities & Geography',
  A4: 'A4 · Commerce',
};

const SEARCH_TYPES = [
  { value: 'reference', label: 'Admission Number' },
  { value: 'id', label: 'ID Number' },
];

const statusColor = (status) => {
  switch (status) {
    case 'Admitted':
      return 'text-[#00A3AD] border-[#00A3AD]/50';
    case 'Rejected':
      return 'text-[#D27D2D] border-[#D27D2D]/50';
    case 'Waitlisted':
      return 'text-yellow-400 border-yellow-400/40';
    case 'Under Review':
      return 'text-blue-300 border-blue-300/40';
    default:
      return 'text-[#F4F4F4]/70 border-white/20';
  }
};

export default function TrackApplication() {
  useReveal();

  const [searchType, setSearchType] = useState('reference');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = searchValue.trim();
    if (!value) {
      setError('Please enter a value to search.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setSearched(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('track_application', {
        search_type: searchType,
        search_value: value,
      });

      if (rpcError) {
        console.error('Track application error:', rpcError);
        throw new Error('Something went wrong while searching. Please try again.');
      }

      setResults(data && data.length > 0 ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <SubPageHeader />

      <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Admissions</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            TRACK YOUR <span className="ochre">APPLICATION</span>
          </h1>
          <p className="text-[#F4F4F4]/60 mt-5 max-w-xl mx-auto">
            Enter your Admission Number or ID Number below to check the status of every
            application you've submitted to Mhlanga Senior Secondary School.
          </p>
        </div>

        <div className="glass p-7 sm:p-10 reveal">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-3 block">
                Search By
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SEARCH_TYPES.map((opt) => {
                  const selected = searchType === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setSearchType(opt.value)}
                      className={`text-sm tracking-wide px-4 py-3 border transition-colors ${
                        selected
                          ? 'border-[#00A3AD] bg-[#00A3AD]/[0.08] text-[#00A3AD]'
                          : 'border-white/15 text-[#F4F4F4]/70 hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">
                {searchType === 'reference' ? 'Admission Number' : 'ID Number'}
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 text-[#F4F4F4]/40 pointer-events-none flex items-center" style={{ left: '2px' }}>
                  {searchType === 'reference' ? <Hash size={14} /> : <FileText size={14} />}
                </span>
                <input
                  className="line-input"
                  style={{ paddingLeft: '1.75rem' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'reference' ? 'e.g. MSS-100001' : '13-digit SA ID number'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-btn font-display text-sm tracking-wide flex items-center justify-center gap-2 px-7 py-4 bg-[#00A3AD] text-[#121416] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-fit"
            >
              <Search size={16} />
              {loading ? 'Searching…' : 'Track Application'}
            </button>
          </form>

          {error && (
            <div className="mt-6 border border-[#D27D2D]/40 bg-[#D27D2D]/[0.06] px-5 py-4">
              <p className="flex items-start gap-3 text-sm text-[#F4F4F4]/80">
                <AlertCircle size={18} className="text-[#D27D2D] shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          {searched && !error && results && results.length === 0 && !loading && (
            <div className="mt-6 border border-white/10 bg-white/[0.02] px-5 py-4">
              <p className="flex items-start gap-3 text-sm text-[#F4F4F4]/70">
                <AlertCircle size={18} className="text-[#F4F4F4]/40 shrink-0 mt-0.5" />
                <span>
                  No application was found matching that {searchType === 'reference' ? 'admission number' : 'ID number'}.
                  Please check and try again.
                </span>
              </p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[#00A3AD] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-[#121416]" />
                </span>
                <div>
                  <div className="font-display text-lg tracking-tight">{results[0].full_name}</div>
                  <div className="text-xs text-[#F4F4F4]/50">
                    Admission Number: {results[0].admission_number} · {results.length} application{results.length > 1 ? 's' : ''} found
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((app, idx) => (
                  <div key={idx} className="border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-sm tracking-wide text-[#F4F4F4]/80">
                        Intake {app.intake_year}
                      </span>
                      <span className={`text-xs tracking-widest uppercase px-3 py-1.5 border ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoRow icon={<GraduationCap size={14} />} label="Grade Applying For" value={app.grade_applying} />
                      {app.stream && (
                        <InfoRow
                          icon={<GraduationCap size={14} />}
                          label="Stream"
                          value={STREAM_LABELS[app.stream] || app.stream}
                        />
                      )}
                      <InfoRow icon={<Calendar size={14} />} label="Submitted" value={formattedDate(app.submitted_at)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="text-[#00A3AD] mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="text-xs tracking-widest uppercase text-[#F4F4F4]/40">{label}</div>
        <div className="text-sm text-[#F4F4F4]/85 mt-0.5">{value || '—'}</div>
      </div>
    </div>
  );
}