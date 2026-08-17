import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, RefreshCw, Loader2, AlertCircle, ChevronDown, Users, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/Supabase';
import { sendStatusUpdateEmail } from '@/lib/Emailjs';

const STATUS_OPTIONS = [
  'Application submitted',
  'Under Review',
  'Admitted',
  'Waitlisted',
  'Rejected',
];

const STREAM_LABELS = {
  A1: 'A1 · Mathematics & Physical Sciences',
  A2: 'A2 · Agricultural Sciences',
  A3: 'A3 · Humanities & Geography',
  A4: 'A4 · Commerce',
};

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

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        app.id_number?.toLowerCase().includes(q) ||
        app.reference_number?.toLowerCase().includes(q) ||
        app.full_name?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, search]);

  const handleStatusChange = async (app, newStatus) => {
    if (newStatus === app.status) return;
    setUpdatingId(app.id);

    try {
      const { error } = await supabase
        .from('admissions')
        .update({ status: newStatus })
        .eq('id', app.id);

      if (error) throw error;

      setApplications((current) =>
        current.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
      );

      const streamLabel = app.stream ? STREAM_LABELS[app.stream] || app.stream : 'N/A';

      const emailResult = await sendStatusUpdateEmail({
        toEmail: app.email,
        toName: app.full_name,
        ref: app.reference_number,
        status: newStatus,
        admissionNumber: app.reference_number,
        gradeApplying: app.grade_applying,
        stream: streamLabel,
      });

      if (!emailResult.ok) {
        console.warn('Status updated, but email failed to send:', emailResult.error);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // Export to Excel
  // --------------------------------------------------

  const handleExport = () => {
    if (filtered.length === 0) {
      alert('No applications to export for the current filter.');
      return;
    }

    const rows = filtered.map((app) => {
      const streamLabel = app.stream ? STREAM_LABELS[app.stream] || app.stream : '';
      const documentsList =
        Array.isArray(app.documents) && app.documents.length
          ? app.documents.map((d) => `${d.name} (${d.type})`).join('; ')
          : '';

      return {
        'Reference Number': app.reference_number || '',
        'Full Name': app.full_name || '',
        'Date of Birth': app.date_of_birth || '',
        'ID Number': app.id_number || '',
        'Email': app.email || '',
        'Contact Number': app.contact_number || '',
        'Home Address': app.home_address || '',
        'Race': app.race || '',
        'Gender': app.gender || '',
        'Guardian Name': app.guardian_name || '',
        'Guardian ID': app.guardian_id || '',
        'Guardian Contact Number': app.guardian_contact_number || '',
        'Grade Applying': app.grade_applying || '',
        'Stream': streamLabel,
        'June Results': app.june_results || '',
        'December Results': app.december_results || '',
        'Documents': documentsList,
        'Status': app.status || '',
        'Submitted At': app.submitted_at ? new Date(app.submitted_at).toLocaleString('en-ZA') : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns roughly based on content length
    const colWidths = Object.keys(rows[0]).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String(r[key] ?? '').length)
      );
      return { wch: Math.min(Math.max(maxLen + 2, 10), 50) };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

    const dateStamp = new Date().toISOString().slice(0, 10);
    const filterLabel = statusFilter === 'All' ? 'All' : statusFilter.replace(/\s+/g, '-');
    XLSX.writeFile(workbook, `Mhlanga-Applications-${filterLabel}-${dateStamp}.xlsx`);
  };

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <header className="border-b border-white/10 px-5 sm:px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl tracking-tight">
            ADMIN <span className="ochre">DASHBOARD</span>
          </h1>
          <p className="text-xs text-[#F4F4F4]/50 mt-1">Mhlanga Senior Secondary School</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5 border border-white/15 hover:border-[#D27D2D] hover:text-[#D27D2D] transition-colors"
        >
          <LogOut size={14} /> Log Out
        </button>
      </header>

      <main className="px-5 sm:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
          <StatCard label="All" count={applications.length} active={statusFilter === 'All'} onClick={() => setStatusFilter('All')} />
          {STATUS_OPTIONS.map((s) => (
            <StatCard
              key={s}
              label={s}
              count={applications.filter((a) => a.status === s).length}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F4F4]/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID number, or admission number…"
              className="w-full bg-white/[0.03] border border-white/15 focus:border-[#00A3AD] focus:outline-none pl-10 pr-4 py-3 text-sm text-[#F4F4F4] placeholder:text-[#F4F4F4]/35 transition-colors"
            />
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase px-5 py-3 border border-white/15 hover:border-[#00A3AD] hover:text-[#00A3AD] transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={loading || filtered.length === 0}
            className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase px-5 py-3 border border-[#00A3AD]/50 text-[#00A3AD] hover:bg-[#00A3AD]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download size={14} /> Download Sheet
          </button>
        </div>

        {error && (
          <div className="mb-6 border border-[#D27D2D]/40 bg-[#D27D2D]/[0.06] px-5 py-4">
            <p className="flex items-start gap-3 text-sm text-[#F4F4F4]/80">
              <AlertCircle size={18} className="text-[#D27D2D] shrink-0 mt-0.5" />
              <span>{error}</span>
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#F4F4F4]/50">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading applications…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#F4F4F4]/40">
            <Users size={32} className="mb-3" />
            <p>No applications match your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                updating={updatingId === app.id}
                onStatusChange={(status) => handleStatusChange(app, status)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left border p-4 transition-colors ${
        active ? 'border-[#00A3AD] bg-[#00A3AD]/[0.08]' : 'border-white/10 hover:border-white/25'
      }`}
    >
      <div className={`font-display text-2xl ${active ? 'text-[#00A3AD]' : 'text-[#F4F4F4]'}`}>{count}</div>
      <div className="text-[10px] tracking-widest uppercase text-[#F4F4F4]/50 mt-1">{label}</div>
    </button>
  );
}

function ApplicationRow({ app, updating, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const streamLabel = app.stream ? STREAM_LABELS[app.stream] || app.stream : null;

  return (
    <div className="border border-white/10 bg-white/[0.015]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-5 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="font-display text-base tracking-tight truncate">{app.full_name}</div>
          <div className="text-xs text-[#F4F4F4]/45 mt-0.5">
            {app.reference_number} · {app.grade_applying}
            {streamLabel ? ` · ${streamLabel}` : ''}
          </div>
        </div>

        <span className={`shrink-0 text-xs tracking-widest uppercase px-3 py-1.5 border ${statusColor(app.status)}`}>
          {app.status}
        </span>

        <ChevronDown size={16} className={`shrink-0 text-[#F4F4F4]/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-white/10 pt-5 space-y-6">
          {/* Personal Details */}
          <div>
            <h4 className="text-[10px] tracking-widest uppercase text-[#00A3AD]/80 mb-3">Applicant Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Detail label="ID Number" value={app.id_number} />
              <Detail label="Email" value={app.email} />
              <Detail label="Contact No" value={app.contact_number} />
              <Detail label="Home Address" value={app.home_address} />
              <Detail label="Guardian" value={app.guardian_name} />
              <Detail label="Guardian ID" value={app.guardian_id} />
              <Detail label="Guardian Contact" value={app.guardian_contact_number} />
              <Detail label="Date of Birth" value={app.date_of_birth} />
              <Detail label="Race" value={app.race} />
              <Detail label="Gender" value={app.gender} />
              <Detail label="Submitted" value={app.submitted_at ? new Date(app.submitted_at).toLocaleString('en-ZA') : '—'} />
            </div>
          </div>

          {/* Academic Information */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-[10px] tracking-widest uppercase text-[#00A3AD]/80 mb-3">Academic Information</h4>
            <div className={`grid grid-cols-1 ${streamLabel ? 'sm:grid-cols-2' : ''} gap-4 text-sm mb-4`}>
              <Detail label="Grade Applying" value={app.grade_applying} />
              {streamLabel && <Detail label="Stream" value={streamLabel} />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Detail label="June Results" value={app.june_results} multiline />
              <Detail label="December Results" value={app.december_results} multiline />
            </div>
          </div>

          {/* Documents */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-[10px] tracking-widest uppercase text-[#00A3AD]/80 mb-3">Documents Uploaded</h4>
            {Array.isArray(app.documents) && app.documents.length > 0 ? (
              <div className="space-y-2">
                {app.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.02] px-4 py-2 text-sm"
                  >
                    <span className="text-[#F4F4F4]/85 truncate">{doc.name}</span>
                    <span className="text-[#F4F4F4]/40 text-xs shrink-0">({doc.type})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#F4F4F4]/40">None uploaded</p>
            )}
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50">Update Status:</label>
            <select
              value={app.status}
              disabled={updating}
              onChange={(e) => onStatusChange(e.target.value)}
              className="line-input bg-transparent w-auto"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="basalt-bg text-[#F4F4F4]">
                  {s}
                </option>
              ))}
            </select>
            {updating && <Loader2 size={14} className="animate-spin text-[#00A3AD]" />}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, multiline }) {
  return (
    <div>
      <div className="text-[10px] tracking-widest uppercase text-[#F4F4F4]/40">{label}</div>
      <div className={`text-[#F4F4F4]/85 mt-0.5 break-words ${multiline ? 'whitespace-pre-line' : ''}`}>
        {value || '—'}
      </div>
    </div>
  );
}