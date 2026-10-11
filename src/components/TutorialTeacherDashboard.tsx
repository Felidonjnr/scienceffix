import { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, CheckCircle2, ClipboardList, LogOut, Plus, RefreshCw, Send, Users, X } from 'lucide-react';
import type { StudentAssignment, TeacherDashboardData, AssignmentQuestionItem, StudentLearningPlan, TeachingSessionLog, TeacherFollowUpItem } from '../types/studentPortal';
import type { Subject } from '../types';

type StudentSummary = TeacherDashboardData['studentsSummary'][number];
type Detail = { student?: { name?: string; phone?: string; currentGoal?: string }; profile?: any; learningPlan?: StudentLearningPlan; assignments?: StudentAssignment[]; sessions?: TeachingSessionLog[]; topicMastery?: any[]; followUps?: TeacherFollowUpItem[]; [key: string]: any };
const SUBJECTS: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
const card = 'rounded-xl border border-slate-200 bg-white p-4 sm:p-5';
const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none';
const button = 'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';

export default function TutorialTeacherDashboard() {
  const [key, setKey] = useState(() => sessionStorage.getItem('sciencefix_teacher_key') || '');
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [studentId, setStudentId] = useState('');
  const [detail, setDetail] = useState<Detail | null>(null);
  const [tab, setTab] = useState<'assignments' | 'students' | 'lessons' | 'progress' | 'followups'>('assignments');
  const [subject, setSubject] = useState<Subject>('Chemistry');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('Complete the questions carefully.');
  const [draft, setDraft] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [studentForm, setStudentForm] = useState({ name: '', phone: '', goal: '', level: 'F' });
  const [newStudentCode, setNewStudentCode] = useState('');
  const [reviewing, setReviewing] = useState<StudentAssignment | null>(null);
  const [feedback, setFeedback] = useState('');
  const [teacherScore, setTeacherScore] = useState('');
  const [plan, setPlan] = useState<StudentLearningPlan | null>(null);
  const [lesson, setLesson] = useState({ subject: 'Chemistry' as Subject, topic: '', subtopic: '', whatWasTaught: '', struggles: '', teacherEmphasis: '', understandingLevel: 3 as 1|2|3|4|5, recommendedNextStep: '' });

  const headers = () => ({ 'x-admin-key': key.trim(), 'Content-Type': 'application/json' });
  const selected = useMemo(() => dashboard?.studentsSummary.find(s => s.id === studentId), [dashboard, studentId]);
  const assignments = detail?.assignments || [];

  async function request(url: string, init: RequestInit = {}) {
    const res = await fetch(url, { ...init, headers: { ...headers(), ...(init.headers || {}) } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  }
  async function loadDashboard(preferredId = studentId) {
    if (!key.trim()) { setError('Enter your teacher access key.'); return; }
    setBusy(true); setError('');
    try {
      const data = await request('/api/tutorial/teacher/dashboard');
      setDashboard(data);
      sessionStorage.setItem('sciencefix_teacher_key', key.trim());
      const next = data.studentsSummary?.some((s: StudentSummary) => s.id === preferredId) ? preferredId : data.studentsSummary?.[0]?.id || '';
      setStudentId(next);
      if (next) await loadStudent(next); else { setDetail(null); setPlan(null); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load teacher workspace.'); }
    finally { setBusy(false); }
  }
  async function loadStudent(id: string) {
    setStudentId(id); setDraft(null);
    if (!id) { setDetail(null); setPlan(null); return; }
    try {
      const data = await request('/api/tutorial/teacher/students/' + encodeURIComponent(id));
      setDetail(data); setPlan(data.learningPlan || null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load student.'); }
  }
  useEffect(() => { const saved = sessionStorage.getItem('sciencefix_teacher_key'); if (saved) void loadDashboard(); /* mount only */ }, []);
  async function generate(e: React.FormEvent) {
    e.preventDefault(); if (!studentId) { setError('Select a student first.'); return; }
    setBusy(true); setError(''); setNotice('');
    try { const data = await request('/api/tutorial/teacher/assignment-draft', { method: 'POST', body: JSON.stringify({ studentId, subject, topic: topic.trim(), count }) }); setDraft({ ...data.assignment, instructions }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not generate questions.'); } finally { setBusy(false); }
  }
  async function saveAssignment(status: 'draft'|'pending') {
    if (!draft || !studentId) return;
    setBusy(true); setError('');
    try {
      await request('/api/tutorial/teacher/assignments', { method: 'POST', body: JSON.stringify({ ...draft, studentId, subject, topic: topic.trim(), instructions, status }) });
      setDraft(null); setTopic(''); setNotice(status === 'draft' ? 'Draft saved.' : 'Assignment published for the student.');
      await loadDashboard(studentId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save assignment.'); } finally { setBusy(false); }
  }
  async function publish(id: string) {
    setBusy(true); setError('');
    try { await request('/api/tutorial/teacher/assignments/' + encodeURIComponent(id) + '/publish', { method: 'POST' }); setNotice('Assignment published.'); await loadDashboard(studentId); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not publish assignment.'); } finally { setBusy(false); }
  }
  async function saveStudent(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setNewStudentCode('');
    try {
      const data = await request('/api/tutorial/teacher/students', { method: 'POST', body: JSON.stringify({ ...studentForm, subjects: SUBJECTS }) });
      setNewStudentCode(data.accessCode || data.student?.accessCode || '');
      setStudentForm({ name: '', phone: '', goal: '', level: 'F' }); setNotice('Student profile created. Copy the access code before leaving this page.');
      await loadDashboard(data.student?.id || '');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create student.'); } finally { setBusy(false); }
  }
  async function submitReview(e: React.FormEvent) {
    e.preventDefault(); if (!reviewing) return; setBusy(true); setError('');
    try {
      await request('/api/tutorial/teacher/assignments/' + encodeURIComponent(reviewing.id) + '/review', { method: 'POST', body: JSON.stringify({ feedback, ...(teacherScore.trim() ? { teacherScore: Number(teacherScore) } : {}) }) });
      setReviewing(null); setFeedback(''); setTeacherScore(''); setNotice('Feedback saved.'); await loadDashboard(studentId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save feedback.'); } finally { setBusy(false); }
  }
  async function savePlan(e: React.FormEvent) {
    e.preventDefault(); if (!plan || !studentId) return; setBusy(true); setError('');
    try {
      await request('/api/tutorial/teacher/learning-plan', { method: 'POST', body: JSON.stringify({ studentId, plan }) });
      setNotice('Learning plan updated.'); await loadDashboard(studentId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save learning plan.'); } finally { setBusy(false); }
  }
  async function logLesson(e: React.FormEvent) {
    e.preventDefault(); if (!studentId) { setError('Select a student first.'); return; }
    setBusy(true); setError('');
    try {
      await request('/api/tutorial/teacher/lesson', { method: 'POST', body: JSON.stringify({ studentId, ...lesson, date: new Date().toISOString() }) });
      setLesson({ subject, topic: '', subtopic: '', whatWasTaught: '', struggles: '', teacherEmphasis: '', understandingLevel: 3, recommendedNextStep: '' });
      setNotice('Lesson log saved.'); await loadDashboard(studentId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save lesson log.'); } finally { setBusy(false); }
  }
  async function resolveFollowup(id: string) {
    setBusy(true); setError('');
    try { await request('/api/tutorial/teacher/followups/' + encodeURIComponent(id) + '/resolve', { method: 'POST' }); setNotice('Follow-up marked resolved.'); await loadDashboard(studentId); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not resolve follow-up.'); } finally { setBusy(false); }
  }
  function signOut() { sessionStorage.removeItem('sciencefix_teacher_key'); setKey(''); setDashboard(null); setDetail(null); setPlan(null); setStudentId(''); setDraft(null); setError(''); setNotice(''); }

  if (!dashboard) return <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900"><section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">ScienceFix</p><h1 className="mt-2 text-2xl font-bold">Teacher Portal</h1><p className="mt-2 text-sm text-slate-600">Sign in to manage students, assignments and learning progress.</p><form className="mt-6 space-y-4" onSubmit={e => { e.preventDefault(); void loadDashboard(); }}><label className="block text-sm font-semibold" htmlFor="teacher-key">Teacher access key</label><input id="teacher-key" type="password" autoComplete="current-password" required value={key} onChange={e => setKey(e.target.value)} className={input}/>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy} className={button + ' w-full bg-blue-700 text-white'}>{busy ? 'Signing in…' : 'Sign in'}</button></form></section></main>;

  const nav = [{id:'assignments',label:'Assignments',icon:ClipboardList},{id:'students',label:'Students',icon:Users},{id:'lessons',label:'Lesson log',icon:BookOpen},{id:'progress',label:'Learning plan',icon:Activity},{id:'followups',label:'Follow-ups',icon:CheckCircle2}] as const;
  const allFollowups = (dashboard.followUps || []).filter(f => f.status !== 'resolved');
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">ScienceFix</p><h1 className="text-xl font-bold">Teacher Portal</h1><p className="text-xs text-slate-500">Student assignments and learning support</p></div><div className="flex gap-2"><button onClick={() => void loadDashboard(studentId)} disabled={busy} className={button+' border border-slate-300'}><RefreshCw size={15}/><span className="hidden sm:inline">Refresh</span></button><button onClick={signOut} className={button+' border border-slate-300'}><LogOut size={15}/><span className="hidden sm:inline">Sign out</span></button></div></div></header>
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-5">
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}{notice && <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</div>}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4"><div className={card}><p className="text-xs text-slate-500">Students</p><p className="mt-1 text-2xl font-bold">{dashboard.totalStudents}</p></div><div className={card}><p className="text-xs text-slate-500">Awaiting review</p><p className="mt-1 text-2xl font-bold">{dashboard.submittedAwaitingReviewCount}</p></div><div className={card}><p className="text-xs text-slate-500">Pending assignments</p><p className="mt-1 text-2xl font-bold">{dashboard.pendingAssignmentsCount}</p></div><div className={card}><p className="text-xs text-slate-500">Follow-ups</p><p className="mt-1 text-2xl font-bold">{allFollowups.length}</p></div></section>
      <section className={card}><label htmlFor="student-select" className="mb-2 block text-sm font-semibold">Working with student</label><select id="student-select" value={studentId} onChange={e => void loadStudent(e.target.value)} className={input}><option value="">Choose a student…</option>{dashboard.studentsSummary.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>{selected && <p className="mt-2 text-sm text-slate-600">{selected.goal || 'Student'}{selected.subjects?.length ? ' · '+selected.subjects.join(', ') : ''}</p>}</section>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5">{nav.map(n => {const Icon=n.icon; return <button key={n.id} onClick={() => setTab(n.id)} className={button+' '+(tab===n.id?'bg-blue-700 text-white':'border border-slate-200 bg-white text-slate-700')}><Icon size={16}/>{n.label}</button>})}</nav>

      {tab==='assignments' && <div className="space-y-5">
        <section className={card}><h2 className="mb-4 text-lg font-bold">Create assignment</h2><form onSubmit={generate} className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Subject</label><select className={input} value={subject} onChange={e=>setSubject(e.target.value as Subject)}>{(selected?.subjects?.length?selected.subjects:SUBJECTS).map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label className="mb-1 block text-sm font-medium">Topic taught</label><input className={input} value={topic} onChange={e=>setTopic(e.target.value)} required placeholder="e.g. Linear equations"/></div><div><label className="mb-1 block text-sm font-medium">Questions</label><select className={input} value={count} onChange={e=>setCount(Number(e.target.value))}>{[5,10,15,20].map(n=><option key={n}>{n}</option>)}</select></div><div><label className="mb-1 block text-sm font-medium">Instructions</label><input className={input} value={instructions} onChange={e=>setInstructions(e.target.value)}/></div></div><button disabled={busy||!studentId} className={button+' bg-blue-700 text-white'}><Plus size={16}/>{busy?'Working…':'Generate questions'}</button>{!studentId&&<p className="text-xs text-amber-700">Choose a student above first.</p>}</form>
          {draft&&<div className="mt-5 border-t border-slate-200 pt-4"><h3 className="font-bold">{draft.title}</h3><p className="mt-1 text-sm text-slate-500">{draft.questions?.length||0} questions · {draft.subject} · {draft.topic}</p><ol className="mt-3 list-decimal space-y-3 pl-5">{(draft.questions as AssignmentQuestionItem[]||[]).map((q,i)=><li key={q.id||i} className="text-sm"><p className="font-medium">{q.text}</p><ul className="list-disc pl-5 text-slate-600">{q.options?.map(o=><li key={o.id}>{o.text}</li>)}</ul></li>)}</ol><div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void saveAssignment('draft')} className={button+' border border-slate-300'}>Save draft</button><button disabled={busy} onClick={()=>void saveAssignment('pending')} className={button+' bg-blue-700 text-white'}><Send size={15}/>Publish</button><button onClick={()=>setDraft(null)} className={button+' text-slate-600'}>Cancel</button></div></div>}
        </section>
        <section className={card}><h2 className="text-lg font-bold">Student assignments</h2>{!studentId?<p className="mt-3 text-sm text-slate-500">Select a student to see assignments.</p>:!assignments.length?<p className="mt-3 text-sm text-slate-500">No assignments yet.</p>:<div className="mt-3 divide-y divide-slate-100">{assignments.slice().reverse().map(a=><article key={a.id} className="py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><h3 className="font-semibold">{a.title}</h3><p className="mt-1 text-sm text-slate-500">{a.subject} · {a.topic} · {a.questions?.length||0} questions</p>{a.status==='completed'&&<p className="mt-1 text-sm font-semibold">Auto-marked score: {a.percentage??a.score??0}%</p>}{a.teacherFeedback&&<p className="mt-1 text-sm text-slate-600">Feedback: {a.teacherFeedback}</p>}{a.questionResults?.length ? <details className="mt-2 text-sm"><summary className="cursor-pointer font-medium">Review answers ({a.questionResults.filter(q=>q.isCorrect).length}/{a.questionResults.length} correct)</summary><ol className="mt-2 list-decimal space-y-2 pl-5">{a.questionResults.map(q=><li key={q.questionId}><span>{q.text}</span><p className={q.isCorrect?'text-green-700':'text-red-700'}>{q.isCorrect?'Correct':'Needs practice'} · {q.explanation}</p></li>)}</ol></details>:null}</div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize">{a.status}</span>{a.status==='draft'&&<button disabled={busy} onClick={()=>void publish(a.id)} className={button+' bg-blue-700 text-white'}>Publish</button>}{(a.status==='completed'||a.status==='overdue')&&<button onClick={()=>{setReviewing(a);setFeedback(a.teacherFeedback||'');setTeacherScore('');}} className={button+' border border-slate-300'}>Feedback</button>}</div></div></article>)}</div>}</section>
      </div>}

      {tab==='students'&&<section className={card}><h2 className="mb-1 text-lg font-bold">Add student</h2><p className="mb-4 text-sm text-slate-500">Create a learner profile and generate their access PIN.</p><form onSubmit={saveStudent} className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Full name</label><input required minLength={2} className={input} value={studentForm.name} onChange={e=>setStudentForm({...studentForm,name:e.target.value})}/></div><div><label className="mb-1 block text-sm font-medium">Phone number</label><input className={input} value={studentForm.phone} onChange={e=>setStudentForm({...studentForm,phone:e.target.value})}/></div><div><label className="mb-1 block text-sm font-medium">Learning goal / pathway</label><input className={input} value={studentForm.goal} onChange={e=>setStudentForm({...studentForm,goal:e.target.value})} placeholder="e.g. JAMB, nursing entrance"/></div><div><label className="mb-1 block text-sm font-medium">Starting level</label><select className={input} value={studentForm.level} onChange={e=>setStudentForm({...studentForm,level:e.target.value})}>{[['Z','Starting from zero'],['F','Foundation'],['P','Progressing'],['C','Confident']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div><button disabled={busy} className={button+' bg-blue-700 text-white sm:col-span-2'}>{busy?'Creating…':'Create student profile'}</button></form>{newStudentCode&&<div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4"><p className="text-sm font-semibold">Student access PIN — copy it now</p><p className="my-2 text-3xl font-black tracking-widest">{newStudentCode}</p><p className="text-xs text-slate-600">Share privately with the student. Do not post this code publicly.</p></div>}<h3 className="mt-6 font-semibold">Student directory</h3><div className="mt-2 divide-y divide-slate-100">{dashboard.studentsSummary.map(s=><button key={s.id} onClick={()=>void loadStudent(s.id)} className="flex w-full items-center justify-between gap-3 py-3 text-left"><span><span className="block font-medium">{s.name}</span><span className="text-xs text-slate-500">{s.goal}</span></span><span className="text-xs text-blue-700">Open profile →</span></button>)}</div>{selected&&detail&&<div className="mt-4 rounded-lg bg-slate-50 p-4"><h4 className="font-semibold">{detail.student?.name||selected.name}</h4><p className="mt-1 text-sm text-slate-600">Phone: {detail.student?.phone||selected.phone||'Not provided'}</p><p className="text-sm text-slate-600">Goal: {detail.student?.currentGoal||selected.goal||'Not set'}</p><p className="text-sm text-slate-600">Assignments: {assignments.length} · Completed: {assignments.filter(a=>a.status==='completed').length}</p></div>}</section>}

      {tab==='lessons'&&<div className="space-y-4"><section className={card}><h2 className="mb-4 text-lg font-bold">Log a teaching session</h2><form onSubmit={logLesson} className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Subject</label><select className={input} value={lesson.subject} onChange={e=>setLesson({...lesson,subject:e.target.value as Subject})}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div><div><label className="mb-1 block text-sm font-medium">Topic taught</label><input required className={input} value={lesson.topic} onChange={e=>setLesson({...lesson,topic:e.target.value})}/></div><div><label className="mb-1 block text-sm font-medium">Subtopic</label><input className={input} value={lesson.subtopic} onChange={e=>setLesson({...lesson,subtopic:e.target.value})}/></div><div><label className="mb-1 block text-sm font-medium">Understanding (1–5)</label><select className={input} value={lesson.understandingLevel} onChange={e=>setLesson({...lesson,understandingLevel:Number(e.target.value) as 1|2|3|4|5})}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}{n===1?' — Lost':n===3?' — Developing':n===5?' — Mastered':''}</option>)}</select></div>{([{k:'whatWasTaught',label:'What was taught',required:true},{k:'struggles',label:'Difficulties / misconceptions',required:false},{k:'teacherEmphasis',label:'What to reinforce',required:false},{k:'recommendedNextStep',label:'Recommended next step',required:false}] as const).map(f=><div key={f.k}><label className="mb-1 block text-sm font-medium">{f.label}</label><textarea required={f.required} rows={3} className={input} value={lesson[f.k]} onChange={e=>setLesson({...lesson,[f.k]:e.target.value})}/></div>)}<button disabled={busy||!studentId} className={button+' bg-blue-700 text-white sm:col-span-2'}>{busy?'Saving…':'Save lesson log'}</button></form></section><section className={card}><h3 className="font-bold">Recent lesson history</h3>{!detail?.sessions?.length?<p className="mt-2 text-sm text-slate-500">No lesson logs for this student yet.</p>:<div className="mt-2 divide-y divide-slate-100">{detail.sessions.slice().reverse().map(s=><article key={s.id} className="py-3"><p className="font-semibold">{s.subject}: {s.topic}</p><p className="text-xs text-slate-500">{new Date(s.date||s.createdAt).toLocaleDateString()} · Understanding {s.understandingLevel}/5</p><p className="mt-1 text-sm">{s.whatWasTaught}</p>{s.struggles&&<p className="mt-1 text-sm text-amber-800">Needs support: {s.struggles}</p>}{s.recommendedNextStep&&<p className="mt-1 text-sm text-blue-800">Next: {s.recommendedNextStep}</p>}</article>)}</div>}</section></div>}

      {tab==='progress'&&<section className={card}><h2 className="mb-1 text-lg font-bold">Personal learning plan</h2><p className="mb-4 text-sm text-slate-500">Update focus topics and next steps based on lessons and assignment results.</p>{!plan?<p className="text-sm text-slate-500">Select a student with an existing learning plan.</p>:<form onSubmit={savePlan} className="space-y-4"><div><label className="mb-1 block text-sm font-medium">Next recommended action</label><textarea rows={2} className={input} value={plan.nextRecommendedAction||''} onChange={e=>setPlan({...plan,nextRecommendedAction:e.target.value})}/></div><div><label className="mb-1 block text-sm font-medium">Learning goals (one per line)</label><textarea rows={3} className={input} value={(plan.learningGoals||[]).join('\n')} onChange={e=>setPlan({...plan,learningGoals:e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)})}/></div>{plan.subjects.map((sp,i)=><div key={sp.subject} className="rounded-lg border border-slate-200 p-3"><h3 className="font-semibold">{sp.subject}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm">Current topic</label><input className={input} value={sp.currentTopic} onChange={e=>setPlan({...plan,subjects:plan.subjects.map((x,j)=>j===i?{...x,currentTopic:e.target.value}:x)})}/></div><div><label className="mb-1 block text-sm">Preferred difficulty (1–3)</label><select className={input} value={sp.preferredDifficulty} onChange={e=>setPlan({...plan,subjects:plan.subjects.map((x,j)=>j===i?{...x,preferredDifficulty:Number(e.target.value)}:x)})}>{[1,2,3].map(n=><option key={n}>{n}</option>)}</select></div>{([{k:'weakTopics',label:'Topics to reinforce'},{k:'targetTopics',label:'Target topics'},{k:'completedTopics',label:'Completed topics'}] as const).map(f=><div key={f.k}><label className="mb-1 block text-sm">{f.label} (one per line)</label><textarea rows={3} className={input} value={(sp[f.k]||[]).join('\n')} onChange={e=>setPlan({...plan,subjects:plan.subjects.map((x,j)=>j===i?{...x,[f.k]:e.target.value.split('\n').map(t=>t.trim()).filter(Boolean)}:x)})}/></div>)}</div></div>)}<button disabled={busy} className={button+' bg-blue-700 text-white'}>{busy?'Saving…':'Save learning plan'}</button></form>}{detail?.topicMastery?.length>0&&<div className="mt-6"><h3 className="font-bold">Topic mastery snapshot</h3><div className="mt-2 space-y-3">{detail.topicMastery.map((m:any)=><div key={m.id}><div className="flex justify-between gap-3 text-sm"><span>{m.subject} · {m.topic}</span><span className="font-semibold">{m.masteryPercent}%</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{width:Math.max(0,Math.min(100,m.masteryPercent))+'%'}}/></div><p className="text-xs text-slate-500">{m.trend} · {m.attemptCount} attempts</p></div>)}</div></div>}</section>}

      {tab==='followups'&&<section className={card}><h2 className="text-lg font-bold">Follow-ups requiring attention</h2>{!allFollowups.length?<p className="mt-3 text-sm text-slate-500">No open follow-ups right now.</p>:<div className="mt-3 divide-y divide-slate-100">{allFollowups.map(f=><article key={f.id} className="py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="font-semibold">{f.studentName} · {f.issue}</p><p className="mt-1 text-sm text-slate-600">{f.recommendedAction}</p><p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{f.priority} priority · {f.triggerType.replaceAll('_',' ')}</p></div><button disabled={busy} onClick={()=>void resolveFollowup(f.id)} className={button+' border border-slate-300'}><CheckCircle2 size={15}/>Resolve</button></div></article>)}</div>}</section>}
    </div>
    {reviewing&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"><section className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Assignment feedback</h2><button onClick={()=>setReviewing(null)} aria-label="Close"><X/></button></div><p className="mt-1 text-sm text-slate-500">{reviewing.title} · current score {reviewing.percentage??reviewing.score??'—'}%</p><form onSubmit={submitReview} className="mt-4 space-y-3"><div><label className="mb-1 block text-sm font-medium">Teacher feedback</label><textarea required rows={4} className={input} value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Explain what the student did well and what to practise next."/></div><div><label className="mb-1 block text-sm font-medium">Teacher score override (optional)</label><input type="number" min={0} max={100} className={input} value={teacherScore} onChange={e=>setTeacherScore(e.target.value)} placeholder="Leave blank to keep auto-marked score"/></div><div className="flex gap-2"><button disabled={busy} className={button+' bg-blue-700 text-white'}>{busy?'Saving…':'Save feedback'}</button><button type="button" onClick={()=>setReviewing(null)} className={button+' border border-slate-300'}>Cancel</button></div></form></section></div>}
  </main>;
}
