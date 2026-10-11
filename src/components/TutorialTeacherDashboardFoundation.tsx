import { useEffect, useState } from 'react';
import { LogOut, RefreshCw, ShieldCheck, Users, ClipboardList, CheckCircle2, Clock3 } from 'lucide-react';
import type { TeacherDashboardData } from '../types/studentPortal';

const statCards = [
  { key: 'totalStudents', label: 'Registered students', icon: Users },
  { key: 'pendingAssignmentsCount', label: 'Assignments awaiting submission', icon: ClipboardList },
  { key: 'submittedAwaitingReviewCount', label: 'Submitted assignments', icon: CheckCircle2 },
  { key: 'draftAssignmentsCount', label: 'Saved drafts', icon: Clock3 }
] as const;

export default function TutorialTeacherDashboardFoundation() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('sciencefix_teacher_key') || '');
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWorkspace = async (key = adminKey) => {
    if (!key.trim()) {
      setError('Enter your teacher access key to continue.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tutorial/teacher/dashboard', {
        headers: { 'x-admin-key': key.trim() }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to open the teacher workspace.');
      setDashboard(payload as TeacherDashboardData);
      setAdminKey(key.trim());
      sessionStorage.setItem('sciencefix_teacher_key', key.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem('sciencefix_teacher_key');
    if (savedKey) void loadWorkspace(savedKey);
    // Run once on initial mount to validate a previously saved session key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = () => {
    sessionStorage.removeItem('sciencefix_teacher_key');
    setAdminKey('');
    setDashboard(null);
    setError('');
  };

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100">
        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
            <ShieldCheck size={25} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">ScienceFix · Teacher Portal</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Teacher workspace</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Sign in to check the workspace connection. We are rebuilding this portal one verified feature at a time.</p>
          <form className="mt-7 space-y-4" onSubmit={event => { event.preventDefault(); void loadWorkspace(); }}>
            <label className="block text-sm font-semibold text-slate-200" htmlFor="teacher-key">Teacher access key</label>
            <input
              id="teacher-key"
              type="password"
              autoComplete="current-password"
              value={adminKey}
              onChange={event => setAdminKey(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-base text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              placeholder="Enter access key"
              required
            />
            {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-bold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60" type="submit">
              {loading && <RefreshCw className="animate-spin" size={17} />}
              {loading ? 'Connecting…' : 'Open teacher workspace'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">ScienceFix</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Teacher workspace</h1>
            <p className="mt-1 text-sm text-slate-500">Foundation · Step 1 of the rebuild</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void loadWorkspace()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="font-bold text-blue-950">Workspace connection verified</h2>
          <p className="mt-1 text-sm leading-6 text-blue-900">These figures come from the teacher dashboard API. No student records or assignments have been edited. More tools will be added only after this foundation is checked.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon }) => (
            <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium leading-5 text-slate-500">{label}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={18} /></span>
              </div>
              <p className="mt-4 text-3xl font-black tabular-nums">{dashboard[key] ?? 0}</p>
            </article>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">What is included in Step 1?</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>• Teacher authentication and a clear connection/error state.</li>
            <li>• A small dashboard using real API totals.</li>
            <li>• Refresh and sign-out controls.</li>
            <li>• Existing assignment, student, and database services remain untouched.</li>
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Next, we will add the student directory as a separate, testable step.</p>
        </section>
      </section>
    </main>
  );
}
