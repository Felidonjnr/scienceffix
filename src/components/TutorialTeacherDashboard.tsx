import { useEffect, useMemo, useState } from 'react';
import { LogOut, RefreshCw, Plus, Send, FileText, AlertCircle } from 'lucide-react';
import type { StudentAssignment, TeacherDashboardData, AssignmentQuestionItem } from '../types/studentPortal';
import type { Subject } from '../types';

type StudentSummary = TeacherDashboardData['studentsSummary'][number];
type StudentDetail = { assignments?: StudentAssignment[]; student?: { name?: string }; [key: string]: any };

const DEFAULT_SUBJECTS: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

export default function TutorialTeacherDashboard() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('sciencefix_teacher_key') || '');
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null);
  const [subject, setSubject] = useState<Subject>('Chemistry');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('Complete the questions carefully.');
  const [draft, setDraft] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const headers = () => ({ 'x-admin-key': adminKey.trim(), 'Content-Type': 'application/json' });
  const selectedStudent = useMemo(
    () => dashboard?.studentsSummary.find(student => student.id === selectedStudentId),
    [dashboard, selectedStudentId]
  );

  async function loadDashboard(key = adminKey) {
    if (!key.trim()) {
      setError('Enter your teacher access key.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tutorial/teacher/dashboard', { headers: { 'x-admin-key': key.trim() } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to load teacher workspace.');
      setDashboard(data as TeacherDashboardData);
      setAdminKey(key.trim());
      sessionStorage.setItem('sciencefix_teacher_key', key.trim());
      const nextId = selectedStudentId && data.studentsSummary?.some((s: StudentSummary) => s.id === selectedStudentId)
        ? selectedStudentId
        : data.studentsSummary?.[0]?.id || '';
      setSelectedStudentId(nextId);
      if (!nextId) setStudentDetail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to the teacher service.');
    } finally {
      setLoading(false);
    }
  }

  async function loadStudent(studentId: string) {
    setSelectedStudentId(studentId);
    setDraft(null);
    if (!studentId) {
      setStudentDetail(null);
      return;
    }
    setLoadingStudent(true);
    setError('');
    try {
      const response = await fetch('/api/tutorial/teacher/students/' + encodeURIComponent(studentId), { headers: headers() });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to load this student.');
      setStudentDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load student details.');
    } finally {
      setLoadingStudent(false);
    }
  }

  useEffect(() => {
    const savedKey = sessionStorage.getItem('sciencefix_teacher_key');
    if (savedKey) void loadDashboard(savedKey);
    // Validate a previously saved access key once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dashboard && selectedStudentId) void loadStudent(selectedStudentId);
    // Student detail is loaded whenever the selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard?.studentsSummary?.length, selectedStudentId]);

  async function generateDraft(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedStudentId) {
      setError('Select a student first.');
      return;
    }
    if (!topic.trim()) {
      setError('Enter the topic that was taught.');
      return;
    }
    setCreatingDraft(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/tutorial/teacher/assignment-draft', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ studentId: selectedStudentId, subject, topic: topic.trim(), count })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not generate questions.');
      setDraft({ ...data.assignment, instructions });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate questions.');
    } finally {
      setCreatingDraft(false);
    }
  }

  async function saveAssignment(status: 'draft' | 'pending') {
    if (!draft || !selectedStudentId) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/tutorial/teacher/assignments', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ ...draft, studentId: selectedStudentId, subject, topic: topic.trim(), instructions, status })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save assignment.');
      setDraft(null);
      setTopic('');
      setNotice(status === 'draft' ? 'Assignment saved as a draft.' : 'Assignment published for the student.');
      await loadDashboard();
      await loadStudent(selectedStudentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save assignment.');
    } finally {
      setSaving(false);
    }
  }

  async function publishExisting(assignmentId: string) {
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/tutorial/teacher/assignments/' + encodeURIComponent(assignmentId) + '/publish', {
        method: 'POST',
        headers: headers()
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not publish this assignment.');
      setNotice('Assignment published.');
      await loadDashboard();
      await loadStudent(selectedStudentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish assignment.');
    }
  }

  function signOut() {
    sessionStorage.removeItem('sciencefix_teacher_key');
    setAdminKey('');
    setDashboard(null);
    setStudentDetail(null);
    setSelectedStudentId('');
    setDraft(null);
    setError('');
    setNotice('');
  }

  if (!dashboard) {
    return <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900"><section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">ScienceFix</p>
      <h1 className="mt-2 text-2xl font-bold">Teacher Portal</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to manage student assignments.</p>
      <form className="mt-6 space-y-4" onSubmit={event => { event.preventDefault(); void loadDashboard(); }}>
        <label className="block text-sm font-semibold" htmlFor="teacher-key">Teacher access key</label>
        <input id="teacher-key" type="password" autoComplete="current-password" required value={adminKey} onChange={event => setAdminKey(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600" />
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section></main>;
  }

  const assignments = studentDetail?.assignments || [];
  const studentSubjects = selectedStudent?.subjects?.length ? selectedStudent.subjects : DEFAULT_SUBJECTS;

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
      <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">ScienceFix</p><h1 className="text-xl font-bold">Teacher Portal</h1></div>
      <div className="flex gap-2">
        <button onClick={() => void loadDashboard()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/> Refresh</button>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"><LogOut size={15}/> Sign out</button>
      </div>
    </div></header>
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      {error && <div role="alert" className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle size={18} className="shrink-0"/><span>{error}</span></div>}
      {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="student-select" className="mb-2 block text-sm font-semibold">Select student</label>
        <select id="student-select" value={selectedStudentId} onChange={event => void loadStudent(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base">
          <option value="">Choose a student…</option>
          {dashboard.studentsSummary.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
        </select>
        {selectedStudent && <p className="mt-2 text-sm text-slate-600">{selectedStudent.goal || 'Student'}{selectedStudent.subjects?.length ? ' · ' + selectedStudent.subjects.join(', ') : ''}</p>}
        {loadingStudent && <p className="mt-2 text-sm text-slate-500">Loading student…</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2"><Plus size={18}/><h2 className="text-lg font-bold">Create assignment</h2></div>
        <form onSubmit={generateDraft} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="subject" className="mb-1 block text-sm font-medium">Subject</label><select id="subject" value={subject} onChange={event => setSubject(event.target.value as Subject)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">{studentSubjects.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
            <div><label htmlFor="topic" className="mb-1 block text-sm font-medium">Topic taught</label><input id="topic" value={topic} onChange={event => setTopic(event.target.value)} required placeholder="e.g. Linear equations" className="w-full rounded-lg border border-slate-300 px-3 py-2.5"/></div>
            <div><label htmlFor="count" className="mb-1 block text-sm font-medium">Number of questions</label><select id="count" value={count} onChange={event => setCount(Number(event.target.value))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">{[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            <div><label htmlFor="instructions" className="mb-1 block text-sm font-medium">Instructions</label><input id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5"/></div>
          </div>
          <button disabled={creatingDraft || !selectedStudentId} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50"><FileText size={17}/>{creatingDraft ? 'Preparing questions…' : 'Generate questions'}</button>
        </form>
        {draft && <div className="mt-5 border-t border-slate-200 pt-4">
          <h3 className="font-bold">{draft.title || topic + ' Assignment'}</h3><p className="mt-1 text-sm text-slate-600">{draft.questions?.length || 0} questions · {draft.subject} · {draft.topic}</p>
          <ol className="mt-3 list-decimal space-y-3 pl-5">{(draft.questions as AssignmentQuestionItem[] || []).map((question, index) => <li key={question.id || index} className="text-sm"><p className="font-medium">{question.text}</p><ul className="mt-1 list-disc pl-5 text-slate-600">{question.options?.map(option => <li key={option.id}>{option.text}</li>)}</ul></li>)}</ol>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => void saveAssignment('draft')} disabled={saving} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save as draft'}</button><button onClick={() => void saveAssignment('pending')} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send size={15}/>Publish assignment</button><button onClick={() => setDraft(null)} className="rounded-lg px-4 py-2.5 text-sm text-slate-600">Cancel</button></div>
        </div>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">Assignments</h2>
        {!selectedStudentId ? <p className="mt-3 text-sm text-slate-500">Select a student to view their assignments.</p> : assignments.length === 0 ? <p className="mt-3 text-sm text-slate-500">No assignments for this student yet.</p> : <div className="mt-3 divide-y divide-slate-100">{assignments.map(assignment => <article key={assignment.id} className="py-3 first:pt-0 last:pb-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{assignment.title}</h3><p className="mt-1 text-sm text-slate-600">{assignment.subject} · {assignment.topic} · {assignment.questions?.length || 0} questions</p>{assignment.status === 'completed' && <p className="mt-1 text-sm text-slate-700">Score: {assignment.percentage ?? assignment.score ?? 0}%</p>}{assignment.teacherFeedback && <p className="mt-1 text-sm text-slate-600">Feedback: {assignment.teacherFeedback}</p>}</div><div className="flex items-center gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize">{assignment.status}</span>{assignment.status === 'draft' && <button onClick={() => void publishExisting(assignment.id)} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white">Publish now</button>}</div></div></article>)}</div>}
      </section>
    </div>
  </main>;
}
