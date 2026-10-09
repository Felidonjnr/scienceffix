import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  LogOut, 
  User, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  Award, 
  Compass, 
  HelpCircle, 
  Send, 
  RefreshCw,
  KeyRound,
  GraduationCap,
  Calendar,
  X,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TutorialStudent, 
  StudentHomeDashboardData, 
  DailyFixPractice, 
  ReadingTask, 
  StudentAssignment, 
  AssignmentResult, 
  TopicMasteryRecord 
} from '../types/studentPortal';
import { Subject } from '../types';

interface StudentPortalProps {
  onBackToHome: () => void;
}

export default function StudentPortal({ onBackToHome }: StudentPortalProps) {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sciencefix_portal_token'));
  const [student, setStudent] = useState<TutorialStudent | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Dashboard state
  const [dashboard, setDashboard] = useState<StudentHomeDashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dailyFix' | 'reading' | 'assignments' | 'mastery' | 'aiExplainer'>('overview');

  // Interactive task modals / flows
  const [activeDailyFix, setActiveDailyFix] = useState<DailyFixPractice | null>(null);
  const [dailyFixAnswers, setDailyFixAnswers] = useState<Record<string, string>>({});
  const [dailyFixResult, setDailyFixResult] = useState<AssignmentResult | null>(null);
  const [isSubmittingDailyFix, setIsSubmittingDailyFix] = useState(false);

  const [activeReadingTask, setActiveReadingTask] = useState<ReadingTask | null>(null);
  const [selectedRecallOption, setSelectedRecallOption] = useState<string | null>(null);
  const [isReadingSubmitted, setIsReadingSubmitted] = useState(false);
  const [readingTimer, setReadingTimer] = useState(0);

  const [activeAssignment, setActiveAssignment] = useState<StudentAssignment | null>(null);
  const [assignmentAnswers, setAssignmentAnswers] = useState<Record<string, string>>({});
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResult | null>(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  // Quick concept review AI
  const [conceptQuery, setConceptQuery] = useState('');
  const [conceptReview, setConceptReview] = useState<string | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPathway, setRegPathway] = useState('Nursing & Allied Health');
  const [regLevel, setRegLevel] = useState<'Z' | 'F' | 'P'>('F');
  const [regSubjects, setRegSubjects] = useState<Subject[]>(['Chemistry', 'Biology']);
  const [regSuccessPin, setRegSuccessPin] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Load session or check current token
  useEffect(() => {
    if (token) {
      fetchDashboard(token);
    }
  }, [token]);

  // Reading timer
  useEffect(() => {
    let interval: any;
    if (activeReadingTask && !isReadingSubmitted) {
      interval = setInterval(() => setReadingTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeReadingTask, isReadingSubmitted]);

  const fetchDashboard = async (authToken: string) => {
    setIsLoadingDashboard(true);
    try {
      const res = await fetch('/api/portal/dashboard', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data: StudentHomeDashboardData = await res.json();
        setDashboard(data);
        setStudent(data.student);
      } else {
        // Token expired or invalid
        localStorage.removeItem('sciencefix_portal_token');
        setToken(null);
        setStudent(null);
      }
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleLogin = async (codeToUse?: string) => {
    const code = (codeToUse || pinInput).trim();
    if (!code) {
      setPinError('Please enter your 4-digit student PIN.');
      return;
    }
    setIsAuthenticating(true);
    setPinError(null);
    try {
      const res = await fetch('/api/portal/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('sciencefix_portal_token', data.token);
        setToken(data.token);
        setStudent(data.student);
        setPinInput('');
        fetchDashboard(data.token);
      } else {
        setPinError(data.error || 'Invalid student PIN code.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setPinError('Unable to connect to the Academy database. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sciencefix_portal_token');
    setToken(null);
    setStudent(null);
    setDashboard(null);
    setActiveDailyFix(null);
    setActiveReadingTask(null);
    setActiveAssignment(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;
    setRegLoading(true);
    setRegError(null);
    try {
      const res = await fetch('/api/portal/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          targetPathway: regPathway,
          startingLevel: regLevel,
          subjects: regSubjects,
          currentGoal: regPathway
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setRegSuccessPin(data.accessCode);
        localStorage.setItem('sciencefix_portal_token', data.token);
        setToken(data.token);
        setStudent(data.student);
        fetchDashboard(data.token);
      } else {
        setRegError(data.error || 'Failed to create student account.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setRegError('Network error while registering student. Please check your connection.');
    } finally {
      setRegLoading(false);
    }
  };

  // Daily Fix Practice Flow
  const startDailyFix = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/portal/daily-fix/start', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const practice: DailyFixPractice = await res.json();
        setActiveDailyFix(practice);
        setDailyFixAnswers({});
        setDailyFixResult(null);
        setActiveTab('dailyFix');
      }
    } catch (err) {
      console.error('Error starting daily fix:', err);
    }
  };

  const submitDailyFix = async () => {
    if (!activeDailyFix || !token) return;
    setIsSubmittingDailyFix(true);
    try {
      const submissions = activeDailyFix.questions.map(q => ({
        questionId: q.id,
        selectedOptionId: dailyFixAnswers[q.id] || '',
        timeSpentSeconds: 30
      }));

      const res = await fetch('/api/portal/daily-fix/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          practiceId: activeDailyFix.id,
          submissions
        })
      });

      if (res.ok) {
        const result: AssignmentResult = await res.json();
        setDailyFixResult(result);
        if (token) fetchDashboard(token); // refresh streak & mastery
      }
    } catch (err) {
      console.error('Submit daily fix error:', err);
    } finally {
      setIsSubmittingDailyFix(false);
    }
  };

  // Complete Reading Task Flow
  const handleCompleteReading = async () => {
    if (!activeReadingTask || !token) return;
    try {
      const duration = Math.max(1, Math.ceil(readingTimer / 60));
      const res = await fetch(`/api/portal/reading-tasks/${activeReadingTask.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ durationMinutes: duration })
      });
      if (res.ok) {
        setIsReadingSubmitted(true);
        if (token) fetchDashboard(token);
      }
    } catch (err) {
      console.error('Complete reading task error:', err);
    }
  };

  // Assignment Flow
  const submitAssignment = async () => {
    if (!activeAssignment || !token) return;
    setIsSubmittingAssignment(true);
    try {
      const submissions = activeAssignment.questions.map(q => ({
        questionId: q.id,
        selectedOptionId: assignmentAnswers[q.id] || '',
        timeSpentSeconds: 45
      }));

      const res = await fetch(`/api/portal/assignments/${activeAssignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ submissions })
      });

      if (res.ok) {
        const result: AssignmentResult = await res.json();
        setAssignmentResult(result);
        if (token) fetchDashboard(token);
      }
    } catch (err) {
      console.error('Submit assignment error:', err);
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  // AI Concept Explainer
  const handleRequestReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptQuery.trim()) return;
    setIsLoadingReview(true);
    setConceptReview(null);
    try {
      const res = await fetch('/api/quick-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: conceptQuery.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setConceptReview(data.reviewContent || 'Review ready.');
      } else {
        setConceptReview('Could not fetch quick review at this time. Please try again shortly.');
      }
    } catch (err) {
      console.error('Concept review error:', err);
      setConceptReview('Failed to connect to Academic Review engine.');
    } finally {
      setIsLoadingReview(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: LOGIN & PIN AUTHENTICATION VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (!token || !student) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-10 px-4 sm:px-6">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black tracking-tight text-lg text-white">Science Transition Academy</span>
              <span className="block text-xs text-blue-300 font-bold uppercase tracking-wider">Student Portal</span>
            </div>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition"
          >
            ← Back to Public Website
          </button>
        </header>

        <main className="max-w-md mx-auto w-full my-auto py-10">
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/20 text-blue-400 flex items-center justify-center mb-6">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-black text-white">Student Access</h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Enter your assigned 4-digit student PIN to enter your daily clinic, assignments, and personalized learning plan.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Student PIN / Access Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                    placeholder="e.g. 4091"
                    className="w-full bg-slate-950 border border-white/15 focus:border-blue-500 rounded-xl px-4 py-3.5 text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoFocus
                  />
                </div>
              </div>

              {pinError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Identity…</span>
                  </>
                ) : (
                  <>
                    <span>Enter Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Test Enrolled Students:
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => { setPinInput('4091'); handleLogin('4091'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left text-xs"
                >
                  <div>
                    <span className="font-bold text-white">David Eze</span>
                    <span className="text-slate-400 block text-[11px]">Nursing & Allied Health • Chemistry & Biology</span>
                  </div>
                  <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">PIN: 4091</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPinInput('8214'); handleLogin('8214'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left text-xs"
                >
                  <div>
                    <span className="font-bold text-white">Aisha Bello</span>
                    <span className="text-slate-400 block text-[11px]">Pharmacy Foundation • Commercial to Science</span>
                  </div>
                  <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">PIN: 8214</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPinInput('5532'); handleLogin('5532'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left text-xs"
                >
                  <div>
                    <span className="font-bold text-white">Emeka Okafor</span>
                    <span className="text-slate-400 block text-[11px]">Engineering Foundation • Physics & Maths</span>
                  </div>
                  <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">PIN: 5532</span>
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  Not in the demo list? Create a new student profile
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
          Science Transition Academy • Personalized Tutorial Portal & Mastery Engine
        </footer>

        {/* REGISTRATION MODAL */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black">Register New Student Profile</h3>
                <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {regSuccessPin ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black">Account Created!</h4>
                  <p className="text-sm text-slate-300">
                    Your personal 4-digit PIN is:
                  </p>
                  <div className="font-mono text-3xl font-black bg-white/10 py-3 rounded-2xl text-emerald-300 tracking-widest">
                    {regSuccessPin}
                  </div>
                  <p className="text-xs text-slate-400">
                    Save this PIN. You will use it to log into your daily clinics and homework.
                  </p>
                  <button
                    onClick={() => { setShowRegisterModal(false); setRegSuccessPin(null); }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4 text-sm">
                  {regError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{regError}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Samuel Ade"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Target Pathway</label>
                    <select
                      value={regPathway}
                      onChange={(e) => setRegPathway(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    >
                      <option value="Nursing & Midwifery">Nursing & Midwifery</option>
                      <option value="Pharmacy & Health Sciences">Pharmacy & Health Sciences</option>
                      <option value="Medicine & Surgery">Medicine & Surgery</option>
                      <option value="Engineering & Physical Sciences">Engineering & Physical Sciences</option>
                      <option value="Computer Science / Tech">Computer Science / Tech</option>
                      <option value="General Science Transition">General Science Transition</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Starting Level</label>
                    <select
                      value={regLevel}
                      onChange={(e) => setRegLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    >
                      <option value="Z">Zero Foundation (Non-science / Commercial background)</option>
                      <option value="F">Fragile Foundation (Studied science but forgot most)</option>
                      <option value="P">Practicing Foundation (Needs exam readiness & deeper reasoning)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-white"
                  >
                    {regLoading ? 'Creating Student Profile…' : 'Generate Account & PIN'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: AUTHENTICATED STUDENT PORTAL DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 min-h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="font-black text-slate-950 tracking-tight text-base sm:text-lg block">
                Science Transition Academy
              </span>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest block">
                Student Learning Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Indicator */}
            {dashboard?.streak && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{dashboard.streak.currentStreakDays} Day Streak</span>
              </div>
            )}

            {/* Student Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                {student.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="font-black text-xs text-slate-900 leading-tight">{student.name}</p>
                <p className="text-[11px] text-slate-500 leading-tight">PIN: {student.accessCode}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Compass },
            { id: 'dailyFix', label: 'Daily Fix Clinic', icon: CheckCircle2 },
            { id: 'reading', label: 'Foundation Reading', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: Layers },
            { id: 'mastery', label: 'Topic Mastery', icon: Award },
            { id: 'aiExplainer', label: 'Ask Academy Tutor', icon: Lightbulb },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Student Welcome Banner */}
            <div className="rounded-3xl bg-slate-950 text-white p-7 sm:p-10 relative overflow-hidden shadow-xl">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Target: {student.currentGoal}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Welcome back, {student.name}.
                </h2>
                <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
                  {dashboard?.learningPlan?.nextRecommendedAction ||
                    'Focus on repairing your core concepts today. Consistency over cramming.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => { startDailyFix(); }}
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    <span>Launch Today’s Daily Fix</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onBackToHome()}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition"
                  >
                    View Academy Website
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider">Active Streak</span>
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-3xl font-black text-slate-950">
                  {dashboard?.streak?.currentStreakDays || 1} <span className="text-sm font-bold text-slate-400">days</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Best streak: {dashboard?.streak?.longestStreakDays || 1} days
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider">Active Focus</span>
                  <Compass className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-lg font-black text-slate-950 truncate">
                  {dashboard?.currentFocus?.topic || 'Atomic Structure'}
                </p>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  {dashboard?.currentFocus?.subject || 'Chemistry'}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider">Pending Assignments</span>
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-3xl font-black text-slate-950">
                  {dashboard?.pendingAssignments?.length || 0}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Instructors reviewing your progress
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider">Daily Reading</span>
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-lg font-black text-slate-950">
                  {dashboard?.profile?.dailyReadingTargetMinutes || 15} <span className="text-sm font-bold text-slate-400">mins/day</span>
                </p>
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  1 foundation task queued
                </p>
              </div>
            </div>

            {/* Two-Column Working Section */}
            <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-start">
              {/* Left Column: Learning Roadmap & Tutor Feedback */}
              <div className="space-y-6">
                {/* Tutor Notes */}
                <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-6">
                  <div className="flex items-center gap-2 mb-3 text-amber-800">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-sm uppercase tracking-wider">Personal Tutor Notes</h3>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">
                    {dashboard?.profile?.teacherNotes ||
                      'Welcome to the Academy. Start by taking your time with the foundational questions. Read all explanations carefully.'}
                  </p>
                </div>

                {/* My Subject Learning Plan */}
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-black text-slate-950">Curriculum Progression</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Level: {dashboard?.profile?.overallLevel || 'F'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {dashboard?.learningPlan?.subjects.map((sp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900">{sp.subject}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            Current Focus
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{sp.currentTopic}</p>
                        {sp.weakTopics?.length > 0 && (
                          <div className="text-xs text-slate-500">
                            <span className="font-bold text-rose-600">Reinforcing:</span>{' '}
                            {sp.weakTopics.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pending Action Items */}
              <div className="space-y-6">
                {/* Daily Fix Card */}
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-base text-slate-950">Daily Clinic Routine</h4>
                    <span className="text-xs px-2 py-1 rounded bg-slate-100 font-bold text-slate-600">5 questions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    A short diagnostic set to build automaticity and test mental models without high exam pressure.
                  </p>
                  <button
                    onClick={() => { startDailyFix(); }}
                    className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <span>Start Practice Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Foundation Reading Card */}
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-base text-slate-950">Daily Foundation Reading</h4>
                    <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold">10 mins</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    Bite-sized reading that explains scientific mechanisms before formulas.
                  </p>
                  <button
                    onClick={() => setActiveTab('reading')}
                    className="w-full py-3 rounded-xl border border-slate-300 hover:border-slate-400 font-bold text-sm text-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <span>Open Reading Library</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: DAILY FIX CLINIC ─── */}
        {activeTab === 'dailyFix' && (
          <div className="max-w-3xl mx-auto space-y-8">
            {!activeDailyFix ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">Daily Fix Clinic</h3>
                <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                  Daily deliberate practice designed to repair the foundational links you missed. Each question provides full explanations so you understand why, not just what.
                </p>
                <button
                  onClick={startDailyFix}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-white shadow-lg shadow-blue-600/20"
                >
                  Generate 5-Question Set
                </button>
              </div>
            ) : dailyFixResult ? (
              // Results Display
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto font-black text-2xl ${
                    dailyFixResult.percentage >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {dailyFixResult.percentage}%
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">Clinic Marked & Recorded!</h3>
                  <p className="text-sm text-slate-500">
                    Score: {dailyFixResult.score} / {dailyFixResult.maxScore} points • Saved to your Academy database
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {dailyFixResult.questionResults.map((qr, idx) => (
                    <div
                      key={qr.questionId}
                      className={`p-5 rounded-2xl border ${
                        qr.isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider">
                        <span className={qr.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                          Question {idx + 1} • {qr.isCorrect ? 'Correct' : 'Needs Repair'}
                        </span>
                      </div>
                      <p className="font-black text-sm text-slate-900 mb-3">{qr.text}</p>
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold block text-slate-900 mb-1">Academy Explanation:</span>
                        {qr.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <button
                    onClick={startDailyFix}
                    className="px-6 py-3 rounded-xl bg-slate-950 text-white font-black text-sm"
                  >
                    Start Another Set
                  </button>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-700"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              // Active Practice Taking
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                      {activeDailyFix.subject} • {activeDailyFix.focusTopic}
                    </span>
                    <h3 className="text-xl font-black text-slate-950 mt-1">Daily Fix Practice</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {Object.keys(dailyFixAnswers).length} of {activeDailyFix.questions.length} answered
                  </span>
                </div>

                <div className="space-y-6">
                  {activeDailyFix.questions.map((q, idx) => (
                    <div key={q.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-950 text-white text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Difficulty Level {q.difficulty}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900 leading-relaxed">{q.text}</p>

                      <div className="space-y-2">
                        {q.options.map(opt => {
                          const isSelected = dailyFixAnswers[q.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setDailyFixAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                              className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span>{opt.text}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveDailyFix(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel Session
                  </button>

                  <button
                    onClick={submitDailyFix}
                    disabled={isSubmittingDailyFix || Object.keys(dailyFixAnswers).length === 0}
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-white text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {isSubmittingDailyFix ? 'Marking & Saving…' : 'Submit Clinic for Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: FOUNDATION READING ─── */}
        {activeTab === 'reading' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    Core Science Reading
                  </span>
                  <h3 className="text-2xl font-black text-slate-950 mt-1">
                    How Electrons Inhabit Energy Shells
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{Math.floor(readingTimer / 60)}m {readingTimer % 60}s</span>
                </div>
              </div>

              {/* Reading Content */}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4">
                <p>
                  Electrons are not tiny solid planets orbiting a atomic sun in neat, predictable rings. In modern chemical physics, electrons occupy 3-dimensional clouds of probability called <strong>orbitals</strong>.
                </p>
                <p>
                  The principal energy levels (represented by integer <em>n</em> = 1, 2, 3...) describe the primary distance from the positively charged nucleus. Within each principal energy level, there exist distinct subshells named: <strong>s, p, d, and f</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-sm text-blue-950 font-medium">
                  <p>• The <strong>s subshell</strong> contains 1 orbital and holds a maximum of <strong>2 electrons</strong>.</p>
                  <p>• The <strong>p subshell</strong> contains 3 orbitals and holds a maximum of <strong>6 electrons</strong>.</p>
                  <p>• The <strong>d subshell</strong> contains 5 orbitals and holds a maximum of <strong>10 electrons</strong>.</p>
                </div>
                <p>
                  Remember the <strong>Aufbau principle</strong>: electrons always fill the lowest available energy orbital before pairing up or occupying higher levels. This single rule explains periodic table trends, valence chemistry, and covalent bonding.
                </p>
              </div>

              {/* Recall Check */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
                  Concept Recall Check
                </h4>
                <p className="text-sm font-bold text-slate-800">
                  What is the maximum number of electrons that can occupy any single p subshell?
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: 'a', text: '2 electrons', isCorrect: false },
                    { id: 'b', text: '6 electrons', isCorrect: true },
                    { id: 'c', text: '10 electrons', isCorrect: false },
                    { id: 'd', text: '14 electrons', isCorrect: false }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedRecallOption(opt.id)}
                      className={`p-3.5 rounded-xl border text-sm font-bold text-left transition ${
                        selectedRecallOption === opt.id
                          ? opt.isCorrect
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-rose-600 bg-rose-50 text-rose-900'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                {selectedRecallOption === 'b' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <span className="font-bold">Correct!</span> A p subshell consists of 3 distinct dumbbell-shaped orbitals (px, py, pz), each carrying up to 2 electrons with opposite spins: 3 × 2 = 6.
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleCompleteReading}
                    disabled={isReadingSubmitted || selectedRecallOption !== 'b'}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black text-white text-sm disabled:opacity-50 transition"
                  >
                    {isReadingSubmitted ? '✓ Reading Habit Recorded!' : 'Complete Reading & Record Habit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: ASSIGNMENTS ─── */}
        {activeTab === 'assignments' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-950">Tutorial Homework & Clinics</h3>
                <p className="text-slate-500 text-sm">Targeted problem sets assigned by your Academy tutor.</p>
              </div>
            </div>

            {dashboard?.pendingAssignments?.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-black text-lg text-slate-900">All current assignments completed!</h4>
                <p className="text-xs text-slate-500 mt-1">Check back after your next tutorial session or start a Daily Fix set.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.pendingAssignments?.map(assign => (
                  <div key={assign.id} className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {assign.subject}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          {assign.questions.length} questions • ~{assign.estimatedMinutes} mins
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-slate-900">{assign.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{assign.instructions}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveDailyFix({
                          id: assign.id,
                          studentId: student.id,
                          date: new Date().toISOString().slice(0, 10),
                          subject: assign.subject,
                          focusTopic: assign.topic,
                          reason: 'current_focus',
                          questions: assign.questions,
                          status: 'pending'
                        });
                        setActiveTab('dailyFix');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
                    >
                      Attempt Assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 5: TOPIC MASTERY ─── */}
        {activeTab === 'mastery' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Topic Mastery Breakdown</h3>
              <p className="text-slate-500 text-sm">
                Real-time metrics tracking your conceptual progression across topics.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { topic: 'Atomic Structure', subject: 'Chemistry', pct: 38, attempts: 12, trend: 'Reinforcing' },
                { topic: 'States of Matter', subject: 'Chemistry', pct: 84, attempts: 8, trend: 'Solid' },
                { topic: 'Linear Equations', subject: 'Mathematics', pct: 42, attempts: 10, trend: 'Developing' },
                { topic: 'Proportions & Rates', subject: 'Mathematics', pct: 78, attempts: 10, trend: 'Solid' },
              ].map(item => (
                <div key={item.topic} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-blue-600">{item.subject}</span>
                      <h4 className="font-black text-lg text-slate-900">{item.topic}</h4>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      item.pct >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.trend}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Mastery</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.pct >= 70 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">Tested across {item.attempts} deliberate questions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 6: ASK ACADEMY TUTOR (AI CONCEPT EXPLAINER) ─── */}
        {activeTab === 'aiExplainer' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-3xl bg-slate-950 text-white p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">Foundation Concept Explainer</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Stuck on a scientific idea? Ask the Academy's instructional engine to break it down using first principles and everyday analogies.
              </p>

              <form onSubmit={handleRequestReview} className="space-y-3 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    value={conceptQuery}
                    onChange={(e) => setConceptQuery(e.target.value)}
                    placeholder="e.g. Why does salt dissolve in water? or Explain Newton's Third Law"
                    className="w-full bg-white/10 border border-white/20 focus:border-blue-400 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  <button
                    type="submit"
                    disabled={isLoadingReview || !conceptQuery.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoadingReview ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Explain</span>
                  </button>
                </div>
              </form>
            </div>

            {conceptReview && (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Academy Academic Review</span>
                </div>
                <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {conceptReview}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
