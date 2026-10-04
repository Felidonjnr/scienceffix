import { useMemo, useState } from 'react';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  age_range?: string;
  previous_background?: string;
  desired_pathway?: string;
  science_status?: string;
  biggest_challenge?: string;
  last_studied_science?: string;
  employment_status?: string;
  preferred_schedule?: string;
  target_year?: string;
  wants_founding_cohort?: boolean;
  willingness_to_pay?: string;
  source?: string;
};

export default function AdminDashboard() {
  const [key, setKey] = useState(() => sessionStorage.getItem('science_restart_admin_key') || '');
  const [draftKey, setDraftKey] = useState(key);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadLeads = async (adminKey: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin-leads', {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load leads.');
      sessionStorage.setItem('science_restart_admin_key', adminKey);
      setKey(adminKey);
      setLeads(Array.isArray(data.leads) ? data.leads : []);
    } catch (err) {
      setLeads([]);
      setError(err instanceof Error ? err.message : 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (draftKey.trim()) loadLeads(draftKey.trim());
  };

  const stats = useMemo(() => {
    const pathways = new Set(leads.map(lead => lead.desired_pathway).filter(Boolean)).size;
    const cohort = leads.filter(lead => lead.wants_founding_cohort).length;
    return { total: leads.length, pathways, cohort };
  }, [leads]);

  const exportLeads = async () => {
    const response = await fetch('/api/admin-export', {
      headers: { 'x-admin-key': key }
    });
    if (!response.ok) {
      setError('Export failed. Please sign in again.');
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'science-restart-leads.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!key || error && leads.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="text-xs font-black tracking-[0.22em] text-blue-300">SCIENCE RESTART ACADEMY</p>
          <h1 className="mt-3 text-3xl font-black">Admin dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter the private dashboard key configured in Vercel. The key is kept in this browser session and is never bundled into the app.</p>
          <input
            type="password"
            value={draftKey}
            onChange={event => setDraftKey(event.target.value)}
            placeholder="Admin dashboard key"
            className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400"
            autoFocus
          />
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <button disabled={loading} className="mt-5 w-full rounded-2xl bg-white px-4 py-3 font-black text-slate-950 disabled:opacity-50">
            {loading ? 'Checking…' : 'Open dashboard'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-blue-300">SCIENCE RESTART ACADEMY</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">Pre-launch intelligence</h1>
            <p className="mt-2 text-sm text-slate-400">Founding cohort and readiness-assessment leads captured from the website.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadLeads(key)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/5">Refresh</button>
            <button onClick={exportLeads} className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950">Export CSV</button>
          </div>
        </div>

        {error && <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Total leads" value={stats.total} />
          <Stat label="Founding cohort interest" value={stats.cohort} />
          <Stat label="Distinct pathways" value={stats.pathways} />
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Learner</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Pathway</th>
                  <th className="px-4 py-3">Background</th>
                  <th className="px-4 py-3">Science situation</th>
                  <th className="px-4 py-3">Challenge</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map(lead => (
                  <tr key={lead.id} className="align-top hover:bg-white/[0.03]">
                    <td className="px-4 py-4 whitespace-nowrap text-slate-400">{new Date(lead.created_at).toLocaleString()}</td>
                    <td className="px-4 py-4 font-bold">{lead.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-4">{lead.desired_pathway || '—'}</td>
                    <td className="px-4 py-4">{lead.previous_background || '—'}</td>
                    <td className="px-4 py-4">{lead.science_status || '—'}</td>
                    <td className="px-4 py-4 max-w-xs">{lead.biggest_challenge || '—'}</td>
                    <td className="px-4 py-4">{lead.preferred_schedule || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{lead.willingness_to_pay || '—'}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-500">No leads captured yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}
