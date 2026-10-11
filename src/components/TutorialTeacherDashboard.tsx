import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Edit3,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  KeyRound,
  Layers,
  Lightbulb,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import {
  AssignmentQuestionItem,
  StudentAssignment,
  StudentLearningPlan,
  TeacherDashboardData,
  TeacherFollowUpItem,
  TeachingSessionLog
} from '../types/studentPortal';
import { Subject } from '../types';

type ActiveTab = 'overview' | 'students' | 'assignments' | 'followups';
type StudentProfileTab = 'overview' | 'plan' | 'assignments' | 'mastery' | 'sessions' | 'followups';

export default function TutorialTeacherDashboard() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem('sciencefix_teacher_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'needs_attention' | 'active_today'>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'draft' | 'pending' | 'completed'>('all');

  // Active Student Profile
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetail, setStudentDetail] = useState<any | null>(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [studentProfileTab, setStudentProfileTab] = useState<StudentProfileTab>('overview');

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    phone: '',
    goal: '',
    level: 'F' as 'Z' | 'F' | 'P' | 'C',
    subjects: ['Chemistry', 'Biology', 'Mathematics'] as Subject[]
  });
  const [createdStudentPin, setCreatedStudentPin] = useState<string | null>(null);

  // Assignment Creator Modal
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    studentId: '',
    subject: 'Chemistry' as Subject,
    topic: '',
    count: 5,
    difficulty: 2,
    instructions: 'Complete the questions carefully. Your result will guide the next tutorial step.',
    dueDateDays: 3
  });
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftAssignment, setDraftAssignment] = useState<any | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<AssignmentQuestionItem[]>([]);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string | null>(null);

  // Assignment Reviewer Modal
  const [reviewingAssignment, setReviewingAssignment] = useState<StudentAssignment | null>(null);
  const [teacherFeedbackText, setTeacherFeedbackText] = useState('');
  const [adjustedScore, setAdjustedScore] = useState<number | undefined>(undefined);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Lesson Recording Modal
  const [showLogLessonModal, setShowLogLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    studentId: '',
    date: new Date().toISOString().slice(0, 10),
    subject: 'Chemistry' as Subject,
    topic: '',
    subtopic: '',
    whatWasTaught: '',
    struggles: '',
    teacherEmphasis: '',
    understandingLevel: 3 as 1 | 2 | 3 | 4 | 5,
    recommendedNextStep: ''
  });
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Learning Plan Edit Modal
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [planEditForm, setPlanEditForm] = useState<{
    nextRecommendedAction: string;
    learningGoals: string[];
    weakTopics: string;
    targetTopics: string;
    currentTopic: string;
    subject: Subject;
  }>({
    nextRecommendedAction: '',
    learningGoals: [],
    weakTopics: '',
    targetTopics: '',
    currentTopic: '',
    subject: 'Chemistry'
  });
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Copy feedback state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getHeaders = () => ({
    'x-admin-key': adminKey.trim(),
    'Content-Type': 'application/json'
  });

  const loadDashboard = async () => {
    if (!adminKey.trim()) {
      setError('Enter the teacher / admin key first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tutorial/teacher/dashboard', { headers: getHeaders() });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error('Unexpected response format from the tutorial server.');
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate with teacher workspace.');
      }
      setDashboardData(data);
      setIsAuthenticated(true);
      sessionStorage.setItem('sciencefix_teacher_key', adminKey.trim());
    } catch (err: any) {
      setError(err?.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey.trim()) {
      loadDashboard();
    }
  }, []);

  const openStudentProfile = async (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsLoadingStudent(true);
    try {
      const res = await fetch(`/api/tutorial/teacher/students/${studentId}`, { headers: getHeaders() });
      if (res.ok) {
        const detail = await res.json();
        setStudentDetail(detail);
        setStudentProfileTab('overview');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to load student details.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to student service.');
    } finally {
      setIsLoadingStudent(false);
    }
  };

  const refreshSelectedStudent = async () => {
    if (selectedStudentId) {
      await openStudentProfile(selectedStudentId);
    }
    await loadDashboard();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/tutorial/teacher/students', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newStudentForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not register student.');
      setCreatedStudentPin(data.accessCode);
      await loadDashboard();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Draft Questions Workflow
  const handleGenerateDraft = async () => {
    if (!assignmentForm.studentId) {
      setError('Select a student first.');
      return;
    }
    setIsGeneratingDraft(true);
    setError(null);
    setAssignmentSuccessMsg(null);
    try {
      const res = await fetch('/api/tutorial/teacher/assignment-draft', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: assignmentForm.studentId,
          subject: assignmentForm.subject,
          topic: assignmentForm.topic,
          count: assignmentForm.count
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate draft.');
      setDraftAssignment(data.assignment);
      setDraftQuestions(data.assignment.questions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSaveAssignment = async (asDraft: boolean) => {
    if (!draftAssignment || !draftQuestions.length) return;
    setIsSavingAssignment(true);
    setError(null);
    try {
      const payload = {
        ...draftAssignment,
        title: draftAssignment.title || `${assignmentForm.topic || assignmentForm.subject} Assignment`,
        subject: assignmentForm.subject,
        topic: assignmentForm.topic || draftAssignment.topic,
        instructions: assignmentForm.instructions,
        questions: draftQuestions,
        status: asDraft ? 'draft' : 'pending',
        dueDate: new Date(Date.now() + assignmentForm.dueDateDays * 86400000).toISOString()
      };

      const res = await fetch('/api/tutorial/teacher/assignments', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save assignment.');

      setAssignmentSuccessMsg(asDraft ? 'Assignment saved as Draft!' : 'Assignment published to student portal!');
      setTimeout(() => {
        setShowCreateAssignmentModal(false);
        setDraftAssignment(null);
        setDraftQuestions([]);
        setAssignmentSuccessMsg(null);
      }, 1400);

      await refreshSelectedStudent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSavingAssignment(false);
    }
  };

  const handlePublishExistingDraft = async (assignmentId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tutorial/teacher/assignments/${assignmentId}/publish`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish draft.');
      await refreshSelectedStudent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Review Completed Assignment
  const openAssignmentReview = (assign: StudentAssignment) => {
    setReviewingAssignment(assign);
    setTeacherFeedbackText(assign.teacherFeedback || '');
    setAdjustedScore(assign.score);
  };

  const handleSaveReview = async () => {
    if (!reviewingAssignment) return;
    setIsSavingReview(true);
    try {
      const res = await fetch(`/api/tutorial/teacher/assignments/${reviewingAssignment.id}/review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          feedback: teacherFeedbackText,
          teacherScore: adjustedScore
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save review.');
      setReviewingAssignment(null);
      await refreshSelectedStudent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSavingReview(false);
    }
  };

  // Log Teaching Lesson
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.studentId || !lessonForm.topic.trim()) return;
    setIsSavingLesson(true);
    try {
      const res = await fetch('/api/tutorial/teacher/lesson', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(lessonForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record lesson.');
      setShowLogLessonModal(false);
      setLessonForm({
        studentId: selectedStudentId || '',
        date: new Date().toISOString().slice(0, 10),
        subject: 'Chemistry',
        topic: '',
        subtopic: '',
        whatWasTaught: '',
        struggles: '',
        teacherEmphasis: '',
        understandingLevel: 3,
        recommendedNextStep: ''
      });
      await refreshSelectedStudent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Edit Learning Plan
  const openEditPlan = (plan: StudentLearningPlan, profileSubjects: Subject[]) => {
    const primarySubject = plan.subjects[0]?.subject || profileSubjects[0] || 'Chemistry';
    const subjPlan = plan.subjects.find(s => s.subject === primarySubject) || plan.subjects[0];
    setPlanEditForm({
      nextRecommendedAction: plan.nextRecommendedAction || '',
      learningGoals: plan.learningGoals || [],
      currentTopic: subjPlan?.currentTopic || '',
      targetTopics: (subjPlan?.targetTopics || []).join(', '),
      weakTopics: (subjPlan?.weakTopics || []).join(', '),
      subject: primarySubject
    });
    setShowEditPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    setIsSavingPlan(true);
    try {
      const updatedPlan: Partial<StudentLearningPlan> = {
        nextRecommendedAction: planEditForm.nextRecommendedAction,
        learningGoals: planEditForm.learningGoals.filter(Boolean),
        subjects: (studentDetail?.learningPlan?.subjects || []).map((s: any) => {
          if (s.subject === planEditForm.subject) {
            return {
              ...s,
              currentTopic: planEditForm.currentTopic || s.currentTopic,
              targetTopics: planEditForm.targetTopics.split(',').map((t: string) => t.trim()).filter(Boolean),
              weakTopics: planEditForm.weakTopics.split(',').map((t: string) => t.trim()).filter(Boolean)
            };
          }
          return s;
        })
      };

      const res = await fetch('/api/tutorial/teacher/learning-plan', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedStudentId,
          plan: updatedPlan
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update plan.');
      setShowEditPlanModal(false);
      await refreshSelectedStudent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleResolveFollowUp = async (followUpId: string) => {
    try {
      const res = await fetch(`/api/tutorial/teacher/followups/${followUpId}/resolve`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        await refreshSelectedStudent();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Sign out
  const handleSignOut = () => {
    sessionStorage.removeItem('sciencefix_teacher_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setDashboardData(null);
    setSelectedStudentId(null);
    setStudentDetail(null);
  };

  // ──────────────────────────── LOGIN VIEW ────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/20 text-blue-400 flex items-center justify-center mb-6">
            <KeyRound className="w-6 h-6" />
          </div>
          <p className="text-xs text-blue-400 font-black uppercase tracking-wider">Teacher & Tutor Workspace</p>
          <h1 className="text-3xl font-black mt-1 text-white">ScienceFix Teacher Portal</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Enter your admin credentials to open student directories, assign tailored practice, and review submitted clinical work.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              loadDashboard();
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Teacher Access Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter admin dashboard key"
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl py-4 font-black transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                'Open Workspace'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter students
  const filteredStudents = (dashboardData?.studentsSummary || []).filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.phone && student.phone.includes(studentSearch)) ||
      (student.accessCode && student.accessCode.includes(studentSearch)) ||
      (student.goal && student.goal.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (student.currentSubject && student.currentSubject.toLowerCase().includes(studentSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (studentFilter === 'needs_attention') return student.needsAttention;
    if (studentFilter === 'active_today') return student.todayStatus === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-16">
      {/* ─── HEADER ─── */}
      <header className="bg-slate-950 text-white sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center font-black">
              SF
            </div>
            <div>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider">ScienceFix Academy</p>
              <h1 className="text-xl font-black">Teacher Workspace & Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void loadDashboard()}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
              title="Refresh Workspace Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => {
                setShowAddStudentModal(true);
                setCreatedStudentPin(null);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-black text-white transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Student
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold text-rose-300 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 border-t border-white/5 pt-2 pb-0">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Compass },
            { id: 'students', label: `Student Directory (${dashboardData?.totalStudents || 0})`, icon: Users },
            { id: 'assignments', label: 'Assignments & Clinics', icon: Layers },
            { id: 'followups', label: `Follow-ups (${dashboardData?.followUps?.length || 0})`, icon: AlertTriangle }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                  active
                    ? 'border-blue-500 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ══════════════ TAB 1: DASHBOARD OVERVIEW ══════════════ */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-8">
            {/* Live Metrics Grid (Every stat comes from real application data) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-3xl font-black text-slate-900">{dashboardData.totalStudents}</p>
                <p className="text-xs text-slate-400 mt-1">Actively enrolled</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Today</span>
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-3xl font-black text-emerald-600">{dashboardData.activeToday}</p>
                <p className="text-xs text-slate-400 mt-1">Completed daily clinics</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Awaiting Submission</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-3xl font-black text-amber-600">{dashboardData.pendingAssignmentsCount}</p>
                <p className="text-xs text-slate-400 mt-1">Pending student answer</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Submitted / Review</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-3xl font-black text-indigo-600">{dashboardData.submittedAwaitingReviewCount || 0}</p>
                <p className="text-xs text-slate-400 mt-1">Completed work to review</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Needs Follow-up</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-3xl font-black text-rose-600">{dashboardData.attentionRequiredCount}</p>
                <p className="text-xs text-slate-400 mt-1">Struggles or low scores</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity split */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Students Needing Attention & Recent Lessons */}
              <div className="lg:col-span-2 space-y-6">
                {/* Attention Required Banner */}
                {dashboardData.attentionRequiredCount > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-rose-800">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <h3 className="font-black text-lg">Students Needing Intervention</h3>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-200 text-rose-800">
                        {dashboardData.attentionRequiredCount} flagged
                      </span>
                    </div>

                    <div className="space-y-3">
                      {dashboardData.studentsSummary
                        .filter(s => s.needsAttention)
                        .map(s => (
                          <div
                            key={s.id}
                            className="bg-white rounded-2xl p-4 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900">{s.name}</span>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  PIN: {s.accessCode}
                                </span>
                              </div>
                              <p className="text-xs text-rose-600 mt-1 font-semibold">
                                {s.attentionReason || `Recent diagnostic/practice score low (${s.recentAverageScore}%)`}
                              </p>
                            </div>

                            <button
                              onClick={() => openStudentProfile(s.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                            >
                              Open Profile <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recent Teaching Activity */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Recent Teaching Activity</h3>
                      <p className="text-xs text-slate-500">Live lessons logged across tutorial students</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowLogLessonModal(true);
                        setLessonForm(f => ({ ...f, studentId: dashboardData.studentsSummary[0]?.id || '' }));
                      }}
                      className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log New Lesson
                    </button>
                  </div>

                  {dashboardData.recentSessions && dashboardData.recentSessions.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentSessions.map(session => {
                        const studentName =
                          dashboardData.studentsSummary.find(s => s.id === session.studentId)?.name || 'Student';
                        return (
                          <div key={session.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                  {session.subject}
                                </span>
                                <span className="font-black text-sm text-slate-900">{session.topic}</span>
                                <span className="text-xs text-slate-400">with {studentName}</span>
                              </div>
                              <span className="text-xs text-slate-500 font-mono">{session.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{session.whatWasTaught}</p>
                            {session.struggles && (
                              <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                <strong>Observed struggles:</strong> {session.struggles}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No lessons recorded yet. Click "Log New Lesson" to record your first session.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Quick Directory & Tools */}
              <div className="space-y-6">
                {/* Active Students Quick Cards */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-base text-slate-900">Student Directory</h3>
                    <button
                      onClick={() => setActiveTab('students')}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      View All ({dashboardData.totalStudents})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {dashboardData.studentsSummary.slice(0, 5).map(s => (
                      <button
                        key={s.id}
                        onClick={() => openStudentProfile(s.id)}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                            {s.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {s.currentSubject} • {s.currentTopic}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-700">{s.recentAverageScore}%</span>
                          <span className="block text-[10px] text-slate-400">avg score</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Open Follow-up Items */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-black text-base text-slate-900 mb-3">Open Interventions</h3>
                  {dashboardData.followUps && dashboardData.followUps.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.followUps.slice(0, 4).map(fu => (
                        <div key={fu.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{fu.studentName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                              {fu.priority}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mb-2">{fu.issue}</p>
                          <button
                            onClick={() => handleResolveFollowUp(fu.id)}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark Resolved
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No outstanding intervention items.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TAB 2: STUDENT DIRECTORY ══════════════ */}
        {activeTab === 'students' && dashboardData && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Student Directory</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Secure access, assigned PINs, enrolled subjects, and learning pathways.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddStudentModal(true);
                  setCreatedStudentPin(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 self-start sm:self-auto shadow-md shadow-blue-600/20"
              >
                <UserPlus className="w-4 h-4" /> Add New Student
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search by student name, PIN, phone, or goal..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All Students' },
                  { id: 'needs_attention', label: 'Needs Follow-up' },
                  { id: 'active_today', label: 'Active Today' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStudentFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                      studentFilter === f.id
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Table / Cards */}
            <div className="grid gap-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-lg text-slate-900">{student.name}</h3>
                          {student.overallLevel && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 uppercase">
                              Level {student.overallLevel}
                            </span>
                          )}
                          {student.todayStatus === 'completed' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                              Active Today
                            </span>
                          )}
                          {student.needsAttention && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Attention Required
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Goal: <span className="font-semibold text-slate-700">{student.goal}</span> • Studying:{' '}
                          <span className="font-semibold text-slate-700">
                            {student.subjects?.join(', ') || student.currentSubject}
                          </span>
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                            PIN:{' '}
                            <span className="font-mono font-black text-slate-900">{student.accessCode || '—'}</span>
                            <button
                              onClick={() => student.accessCode && handleCopy(student.accessCode)}
                              className="text-blue-600 hover:text-blue-800 text-[10px] font-bold ml-1"
                              title="Copy student PIN"
                            >
                              {copiedCode === student.accessCode ? 'Copied!' : 'Copy'}
                            </button>
                          </span>
                          {student.phone && <span>Phone: {student.phone}</span>}
                          {student.createdAt && (
                            <span>Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">{student.recentAverageScore}%</span>
                        <span className="block text-[10px] text-slate-400">average accuracy</span>
                      </div>

                      <button
                        onClick={() => openStudentProfile(student.id)}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-1.5"
                      >
                        Open Profile <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-bold text-sm text-slate-600">No students found matching your criteria</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ TAB 3: ASSIGNMENTS & CLINICS ══════════════ */}
        {activeTab === 'assignments' && dashboardData && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Assignment Workspace</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Create, review, and track personalized assignments across all enrolled students.
                </p>
              </div>

              <button
                onClick={() => {
                  setAssignmentForm(f => ({
                    ...f,
                    studentId: dashboardData.studentsSummary[0]?.id || '',
                    topic: dashboardData.studentsSummary[0]?.currentTopic || ''
                  }));
                  setDraftAssignment(null);
                  setDraftQuestions([]);
                  setShowCreateAssignmentModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 self-start sm:self-auto shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Create New Assignment
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Drafts</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{dashboardData.draftAssignmentsCount || 0}</p>
                <p className="text-[11px] text-slate-400">Saved, unpublished</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Pending</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{dashboardData.pendingAssignmentsCount}</p>
                <p className="text-[11px] text-slate-400">Waiting for submission</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Submitted Work</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {dashboardData.submittedAwaitingReviewCount || 0}
                </p>
                <p className="text-[11px] text-slate-400">Completed by student</p>
              </div>
            </div>

            {/* Guidance banner */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-blue-950">Detailed Student-Specific Assignments</h4>
                <p className="text-xs text-blue-800 mt-0.5">
                  To view and review all assignments for a specific student, click on their profile in the Student Directory.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0"
              >
                Go to Students
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ TAB 4: FOLLOW-UPS & INTERVENTIONS ══════════════ */}
        {activeTab === 'followups' && dashboardData && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Follow-ups & Learning Interventions</h2>
              <p className="text-xs text-slate-500 mt-1">
                Auto-generated and tutor-created intervention alerts based on struggling topics and declining performance.
              </p>
            </div>

            <div className="space-y-3">
              {dashboardData.followUps && dashboardData.followUps.length > 0 ? (
                dashboardData.followUps.map(fu => (
                  <div
                    key={fu.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-base text-slate-900">{fu.studentName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            fu.priority === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : fu.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {fu.priority} priority
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(fu.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">{fu.issue}</p>
                      <p className="text-xs text-blue-700 mt-1 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                        <strong>Recommended intervention:</strong> {fu.recommendedAction}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openStudentProfile(fu.studentId)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        Student Profile
                      </button>
                      <button
                        onClick={() => handleResolveFollowUp(fu.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Resolve
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-black text-slate-800 text-base">All clear!</h4>
                  <p className="text-xs text-slate-400 mt-1">No outstanding learning interventions or follow-ups.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FULL STUDENT PROFILE MODAL / DRAWER
      ═══════════════════════════════════════════════════════════════════ */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-4xl h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
            {isLoadingStudent || !studentDetail ? (
              <div className="flex-1 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Profile Top Bar */}
                <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                      {studentDetail.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black">{studentDetail.student.name}</h2>
                        {studentDetail.profile?.overallLevel && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 uppercase">
                            Level {studentDetail.profile.overallLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {studentDetail.student.currentGoal} • Joined{' '}
                        {new Date(studentDetail.student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* PIN Card */}
                    <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
                      <span className="text-[10px] uppercase text-slate-400 font-bold">PIN:</span>
                      <span className="font-mono font-black text-sm text-yellow-300">
                        {studentDetail.student.accessCode}
                      </span>
                      <button
                        onClick={() => handleCopy(studentDetail.student.accessCode)}
                        className="text-xs text-blue-300 hover:text-white"
                        title="Copy PIN"
                      >
                        {copiedCode === studentDetail.student.accessCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStudentId(null);
                        setStudentDetail(null);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Profile Tabs Navigation */}
                <div className="bg-slate-900 px-6 flex gap-1 border-b border-white/10 shrink-0 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'plan', label: 'Learning Plan' },
                    { id: 'assignments', label: `Assignments (${studentDetail.assignments?.length || 0})` },
                    { id: 'mastery', label: 'Mastery & Progress' },
                    { id: 'sessions', label: `Teaching History (${studentDetail.sessions?.length || 0})` },
                    { id: 'followups', label: `Follow-ups (${studentDetail.followUps?.length || 0})` }
                  ].map(tab => {
                    const active = studentProfileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStudentProfileTab(tab.id as StudentProfileTab)}
                        className={`px-4 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
                          active
                            ? 'border-blue-500 text-white font-black'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Profile Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Quick Action Bar for This Student */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-2 justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase px-2">Quick Actions:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAssignmentForm(f => ({
                            ...f,
                            studentId: studentDetail.student.id,
                            subject: studentDetail.learningPlan?.subjects[0]?.subject || 'Chemistry',
                            topic: studentDetail.learningPlan?.subjects[0]?.currentTopic || ''
                          }));
                          setDraftAssignment(null);
                          setDraftQuestions([]);
                          setShowCreateAssignmentModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Assignment
                      </button>

                      <button
                        onClick={() => {
                          setLessonForm(f => ({
                            ...f,
                            studentId: studentDetail.student.id,
                            subject: studentDetail.learningPlan?.subjects[0]?.subject || 'Chemistry',
                            topic: studentDetail.learningPlan?.subjects[0]?.currentTopic || ''
                          }));
                          setShowLogLessonModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Record Lesson
                      </button>

                      <button
                        onClick={() =>
                          openEditPlan(studentDetail.learningPlan, studentDetail.profile?.subjects || ['Chemistry'])
                        }
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Learning Plan
                      </button>
                    </div>
                  </div>

                  {/* ── PROFILE TAB 1: OVERVIEW ── */}
                  {studentProfileTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                          <span className="text-[11px] font-bold uppercase text-slate-400">Current Streak</span>
                          <p className="text-2xl font-black text-slate-900 mt-1">
                            {studentDetail.streak?.currentStreakDays || 0} days
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Longest: {studentDetail.streak?.longestStreakDays || 0} days
                          </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                          <span className="text-[11px] font-bold uppercase text-slate-400">Target Pathway</span>
                          <p className="text-lg font-black text-slate-900 mt-1 truncate">
                            {studentDetail.profile?.targetPathway || studentDetail.student.currentGoal}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Level: {studentDetail.profile?.overallLevel || 'F'}
                          </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                          <span className="text-[11px] font-bold uppercase text-slate-400">Next Action</span>
                          <p className="text-sm font-bold text-blue-700 mt-1 line-clamp-2">
                            {studentDetail.learningPlan?.nextRecommendedAction || 'Continue active lesson syllabus'}
                          </p>
                        </div>
                      </div>

                      {/* Enrolled Subjects & Current Focus */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h4 className="font-black text-sm text-slate-900 mb-3">Enrolled Subjects & Topics</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {(studentDetail.learningPlan?.subjects || []).map((s: any) => (
                            <div key={s.subject} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-black text-sm text-slate-900">{s.subject}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                  Current Topic
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-blue-600">{s.currentTopic}</p>
                              {s.weakTopics?.length > 0 && (
                                <p className="text-[11px] text-amber-700 mt-1.5">
                                  Needs work: {s.weakTopics.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Assignments Preview */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-black text-sm text-slate-900">Recent Assignments</h4>
                          <button
                            onClick={() => setStudentProfileTab('assignments')}
                            className="text-xs text-blue-600 font-bold hover:underline"
                          >
                            View all ({studentDetail.assignments?.length || 0})
                          </button>
                        </div>

                        {studentDetail.assignments?.length > 0 ? (
                          <div className="space-y-2">
                            {studentDetail.assignments.slice(0, 4).map((assign: any) => (
                              <div
                                key={assign.id}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-bold text-xs text-slate-900">{assign.title}</span>
                                  <span className="block text-[11px] text-slate-400">
                                    {assign.subject} • {assign.topic}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-black px-2 py-0.5 rounded ${
                                      assign.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : assign.status === 'draft'
                                        ? 'bg-slate-200 text-slate-700'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {assign.status === 'completed'
                                      ? `${assign.percentage}%`
                                      : assign.status.toUpperCase()}
                                  </span>
                                  {assign.status === 'completed' && (
                                    <button
                                      onClick={() => openAssignmentReview(assign)}
                                      className="text-xs text-blue-600 font-bold hover:underline"
                                    >
                                      Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 text-center py-4">No assignments created yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── PROFILE TAB 2: LEARNING PLAN ── */}
                  {studentProfileTab === 'plan' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Personalized Learning Plan</h3>
                          <p className="text-xs text-slate-500">
                            Persistent roadmap updated by Academy tutors to steer mastery.
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            openEditPlan(studentDetail.learningPlan, studentDetail.profile?.subjects || ['Chemistry'])
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Plan
                        </button>
                      </div>

                      {/* Next Recommended Action Card */}
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                          Next Recommended Step
                        </span>
                        <h4 className="text-base font-black text-blue-950 mt-1">
                          {studentDetail.learningPlan?.nextRecommendedAction || 'Focus on active lesson objectives'}
                        </h4>
                      </div>

                      {/* Learning Goals */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h4 className="font-black text-sm text-slate-900 mb-3">Stated Learning Goals</h4>
                        <div className="space-y-2">
                          {(studentDetail.learningPlan?.learningGoals || []).map((goal: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subjects Breakdown */}
                      <div className="space-y-4">
                        {(studentDetail.learningPlan?.subjects || []).map((s: any) => (
                          <div key={s.subject} className="bg-white border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3 border-b pb-2">
                              <h5 className="font-black text-base text-slate-900">{s.subject}</h5>
                              <span className="text-xs text-slate-400">
                                Target Topics: {s.targetTopics?.length || 0}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                                  Current Focus
                                </span>
                                <p className="font-black text-slate-900">{s.currentTopic}</p>
                              </div>

                              <div>
                                <span className="font-bold text-amber-600 uppercase text-[10px] block mb-1">
                                  Areas Needing Work
                                </span>
                                <p className="text-slate-700">{s.weakTopics?.join(', ') || 'None flagged'}</p>
                              </div>

                              <div className="sm:col-span-2">
                                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                                  Planned Syllabus Topics
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {(s.targetTopics || []).map((t: string) => (
                                    <span
                                      key={t}
                                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── PROFILE TAB 3: ASSIGNMENTS (DRAFTS, PENDING, COMPLETED) ── */}
                  {studentProfileTab === 'assignments' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Assignments & Problem Sets</h3>
                          <p className="text-xs text-slate-500">
                            Drafts, pending assignments, and graded student submissions.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAssignmentForm(f => ({
                              ...f,
                              studentId: studentDetail.student.id,
                              subject: studentDetail.learningPlan?.subjects[0]?.subject || 'Chemistry',
                              topic: studentDetail.learningPlan?.subjects[0]?.currentTopic || ''
                            }));
                            setDraftAssignment(null);
                            setDraftQuestions([]);
                            setShowCreateAssignmentModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Create Assignment
                        </button>
                      </div>

                      {studentDetail.assignments?.length > 0 ? (
                        <div className="space-y-4">
                          {studentDetail.assignments.map((assign: StudentAssignment) => (
                            <div
                              key={assign.id}
                              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                      {assign.subject}
                                    </span>
                                    <span
                                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                        assign.status === 'completed'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : assign.status === 'draft'
                                          ? 'bg-slate-200 text-slate-700'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {assign.status}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {assign.questions?.length || 0} questions
                                    </span>
                                  </div>
                                  <h4 className="font-black text-base text-slate-900">{assign.title}</h4>
                                  <p className="text-xs text-slate-500">{assign.instructions}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  {assign.status === 'completed' && (
                                    <div className="text-right">
                                      <span
                                        className={`text-2xl font-black ${
                                          (assign.percentage || 0) >= 60 ? 'text-emerald-600' : 'text-amber-600'
                                        }`}
                                      >
                                        {assign.percentage}%
                                      </span>
                                      <span className="block text-[10px] text-slate-400">Score</span>
                                    </div>
                                  )}

                                  {assign.status === 'draft' && (
                                    <button
                                      onClick={() => handlePublishExistingDraft(assign.id)}
                                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                                    >
                                      Publish Now
                                    </button>
                                  )}

                                  {assign.status === 'completed' && (
                                    <button
                                      onClick={() => openAssignmentReview(assign)}
                                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs"
                                    >
                                      Review & Feedback
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Teacher Feedback Preview if present */}
                              {assign.teacherFeedback && (
                                <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 text-xs">
                                  <strong>Teacher Feedback:</strong> {assign.teacherFeedback}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                          No assignments assigned to this student yet.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── PROFILE TAB 4: MASTERY & PROGRESS ── */}
                  {studentProfileTab === 'mastery' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Conceptual Mastery Breakdown</h3>
                        <p className="text-xs text-slate-500">
                          Recorded accuracy across practiced topics based on real submissions.
                        </p>
                      </div>

                      {studentDetail.topicMastery?.length > 0 ? (
                        <div className="grid gap-3">
                          {studentDetail.topicMastery.map((rec: any) => (
                            <div key={rec.id} className="p-4 rounded-2xl bg-white border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-[10px] font-black uppercase text-blue-600">
                                    {rec.subject}
                                  </span>
                                  <h4 className="font-black text-sm text-slate-900">{rec.topic}</h4>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`text-lg font-black ${
                                      rec.masteryPercent >= 70
                                        ? 'text-emerald-600'
                                        : rec.masteryPercent >= 40
                                        ? 'text-amber-600'
                                        : 'text-rose-600'
                                    }`}
                                  >
                                    {rec.masteryPercent}%
                                  </span>
                                  <span className="block text-[10px] text-slate-400">
                                    {rec.correctCount}/{rec.totalQuestions} questions
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    rec.masteryPercent >= 70
                                      ? 'bg-emerald-500'
                                      : rec.masteryPercent >= 40
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${Math.min(100, rec.masteryPercent)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                          No mastery metrics recorded yet. Student needs to submit completed clinics or assignments.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── PROFILE TAB 5: TEACHING SESSIONS HISTORY ── */}
                  {studentProfileTab === 'sessions' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Teaching Session Logs</h3>
                          <p className="text-xs text-slate-500">
                            Historical record of 1-on-1 lessons, observations, and recommendations.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setLessonForm(f => ({
                              ...f,
                              studentId: studentDetail.student.id,
                              subject: studentDetail.learningPlan?.subjects[0]?.subject || 'Chemistry',
                              topic: studentDetail.learningPlan?.subjects[0]?.currentTopic || ''
                            }));
                            setShowLogLessonModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Log Lesson
                        </button>
                      </div>

                      {studentDetail.sessions?.length > 0 ? (
                        <div className="space-y-4">
                          {studentDetail.sessions.map((sess: TeachingSessionLog) => (
                            <div key={sess.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                              <div className="flex items-center justify-between border-b pb-2 mb-3">
                                <div>
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                    {sess.subject}
                                  </span>
                                  <h4 className="font-black text-base text-slate-900 inline ml-2">{sess.topic}</h4>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{sess.date}</span>
                              </div>

                              <div className="space-y-2 text-xs">
                                <div>
                                  <strong className="text-slate-500 block text-[10px] uppercase">
                                    What Was Taught:
                                  </strong>
                                  <p className="text-slate-800">{sess.whatWasTaught}</p>
                                </div>

                                {sess.struggles && (
                                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                                    <strong className="block text-[10px] uppercase text-amber-700">
                                      Observed Struggles:
                                    </strong>
                                    {sess.struggles}
                                  </div>
                                )}

                                <div>
                                  <strong className="text-slate-500 block text-[10px] uppercase">
                                    Recommended Next Step:
                                  </strong>
                                  <p className="text-blue-700 font-semibold">{sess.recommendedNextStep}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                          No teaching sessions recorded yet. Click "Log Lesson" to record one.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── PROFILE TAB 6: FOLLOW-UPS ── */}
                  {studentProfileTab === 'followups' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900">Student Follow-up Tasks</h3>
                      {studentDetail.followUps?.length > 0 ? (
                        <div className="space-y-3">
                          {studentDetail.followUps.map((fu: TeacherFollowUpItem) => (
                            <div key={fu.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-xs text-slate-900">{fu.issue}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    fu.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {fu.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500">{fu.recommendedAction}</p>
                              </div>

                              {fu.status !== 'resolved' && (
                                <button
                                  onClick={() => handleResolveFollowUp(fu.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                          No open follow-ups for this student.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 1: ADD STUDENT MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-black text-xl text-slate-900">Add Tutorial Student</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdStudentPin ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Student Created!</h4>
                <p className="text-xs text-slate-500 mt-1">Provide this secret access PIN to the student:</p>
                <div className="mt-4 p-5 bg-slate-950 text-yellow-300 rounded-2xl font-mono text-4xl font-black tracking-widest inline-block px-8">
                  {createdStudentPin}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  The student uses this 4-digit PIN on the ScienceFix student portal.
                </p>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="mt-6 w-full py-3.5 rounded-xl bg-slate-950 text-white font-black text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.name}
                    onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    placeholder="e.g. David Eze"
                    className="w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newStudentForm.phone}
                      onChange={e => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      placeholder="080XXXXXXXX"
                      className="w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Starting Level</label>
                    <select
                      value={newStudentForm.level}
                      onChange={e => setNewStudentForm({ ...newStudentForm, level: e.target.value as any })}
                      className="w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Z">Level Z (Zero-Start)</option>
                      <option value="F">Level F (Foundation Builder)</option>
                      <option value="P">Level P (Transition Pro)</option>
                      <option value="C">Level C (Clinical Master)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Career Pathway / Exam Goal
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.goal}
                    onChange={e => setNewStudentForm({ ...newStudentForm, goal: e.target.value })}
                    placeholder="e.g. Medicine & Surgery, Nursing, UTME Science"
                    className="w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer"
                >
                  {isLoading ? 'Registering...' : 'Register Student & Generate PIN'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 2: ASSIGNMENT CREATION & PUBLISHING WORKFLOW
      ═══════════════════════════════════════════════════════════════════ */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-900">Create & Publish Assignment</h3>
                <p className="text-xs text-slate-500">
                  Targeted question generator with teacher review, draft saving, and live publishing.
                </p>
              </div>
              <button
                onClick={() => setShowCreateAssignmentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Step 1: Config Parameters */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Student</label>
                  <select
                    value={assignmentForm.studentId}
                    onChange={e => setAssignmentForm({ ...assignmentForm, studentId: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                  >
                    {dashboardData?.studentsSummary.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.goal})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <select
                    value={assignmentForm.subject}
                    onChange={e => setAssignmentForm({ ...assignmentForm, subject: e.target.value as Subject })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                  >
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic</label>
                  <input
                    type="text"
                    value={assignmentForm.topic}
                    onChange={e => setAssignmentForm({ ...assignmentForm, topic: e.target.value })}
                    placeholder="e.g. Atomic Structure & Subshells"
                    className="w-full border rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Questions</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={assignmentForm.count}
                      onChange={e => setAssignmentForm({ ...assignmentForm, count: Number(e.target.value) })}
                      className="w-full border rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Due in (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={assignmentForm.dueDateDays}
                      onChange={e => setAssignmentForm({ ...assignmentForm, dueDateDays: Number(e.target.value) })}
                      className="w-full border rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instructions for Student</label>
                <input
                  type="text"
                  value={assignmentForm.instructions}
                  onChange={e => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingDraft}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  {isGeneratingDraft ? 'Generating Draft Questions...' : 'Generate Reviewable Draft'}
                </button>
              </div>

              {/* Reviewable Questions List */}
              {draftQuestions.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-slate-900">
                      Draft Questions ({draftQuestions.length}) — Review & Edit
                    </h4>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Answer keys kept server-side
                    </span>
                  </div>

                  <div className="space-y-3">
                    {draftQuestions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-bold text-xs text-slate-500">Q{qIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setDraftQuestions(draftQuestions.filter((_, idx) => idx !== qIdx))}
                            className="text-rose-500 hover:text-rose-700 text-xs"
                            title="Remove question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={q.text}
                          onChange={e => {
                            const updated = [...draftQuestions];
                            updated[qIdx].text = e.target.value;
                            setDraftQuestions(updated);
                          }}
                          className="w-full p-2.5 border rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500"
                        />

                        {/* Options */}
                        <div className="mt-2 space-y-1.5">
                          {q.options?.map((opt: any) => {
                            const isCorrect = opt.id === q.correctOptionId;
                            return (
                              <div
                                key={opt.id}
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                                  isCorrect ? 'bg-emerald-50 border border-emerald-300' : 'bg-white border'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {isCorrect ? '✓' : '•'}
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={e => {
                                    const updated = [...draftQuestions];
                                    const targetOpt = updated[qIdx].options.find((o: any) => o.id === opt.id);
                                    if (targetOpt) targetOpt.text = e.target.value;
                                    setDraftQuestions(updated);
                                  }}
                                  className="w-full bg-transparent text-xs focus:outline-none"
                                />
                                {isCorrect && (
                                  <span className="text-[10px] font-bold text-emerald-700 shrink-0">Correct Key</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assignmentSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                  {assignmentSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            {draftQuestions.length > 0 && (
              <div className="pt-4 border-t flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  disabled={isSavingAssignment}
                  onClick={() => handleSaveAssignment(true)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSavingAssignment}
                  onClick={() => handleSaveAssignment(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish to Student Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 3: ASSIGNMENT REVIEW & TEACHER FEEDBACK
      ═══════════════════════════════════════════════════════════════════ */}
      {reviewingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {reviewingAssignment.subject}
                  </span>
                  <h3 className="font-black text-xl text-slate-900">{reviewingAssignment.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed by student • Auto-scored: {reviewingAssignment.score}/{reviewingAssignment.maxScore} (
                  {reviewingAssignment.percentage}%)
                </p>
              </div>

              <button
                onClick={() => setReviewingAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Question By Question Analysis */}
              <div className="space-y-4">
                {reviewingAssignment.questions.map((q, idx) => {
                  const subResult = reviewingAssignment.questionResults?.find(r => r.questionId === q.id);
                  const isCorrect = subResult?.isCorrect;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-600">Question {idx + 1}</span>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? 'Correct (+5)' : 'Incorrect (0)'}
                        </span>
                      </div>

                      <p className="font-semibold text-xs text-slate-900 mb-3">{q.text}</p>

                      <div className="space-y-1.5">
                        {q.options?.map(opt => {
                          const isStudentPick = subResult?.selectedOptionId === opt.id;
                          const isCorrectOpt = opt.id === q.correctOptionId;

                          return (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                isCorrectOpt
                                  ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-950'
                                  : isStudentPick
                                  ? 'bg-rose-100/70 border-rose-300 text-rose-950'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                {isStudentPick && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold">
                                    Student Choice
                                  </span>
                                )}
                                {isCorrectOpt && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <p className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Teacher Comments / Review Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-slate-900">Teacher Clinical Feedback & Review</h4>
                <p className="text-xs text-slate-500">
                  This note will be saved persistently to the student's portal for reflection and guidance.
                </p>

                <textarea
                  rows={3}
                  value={teacherFeedbackText}
                  onChange={e => setTeacherFeedbackText(e.target.value)}
                  placeholder="e.g. Well done on question 2. For question 4, remember Hund's rule applies when filling degenerate orbitals..."
                  className="w-full p-3 border rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setReviewingAssignment(null)}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isSavingReview}
                onClick={handleSaveReview}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
              >
                {isSavingReview ? 'Saving...' : 'Save Teacher Review & Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 4: RECORD LESSON MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {showLogLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b shrink-0">
              <h3 className="font-black text-xl text-slate-900">Log Teaching Session</h3>
              <button
                onClick={() => setShowLogLessonModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="flex-1 overflow-y-auto py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student</label>
                  <select
                    value={lessonForm.studentId}
                    onChange={e => setLessonForm({ ...lessonForm, studentId: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                    required
                  >
                    {dashboardData?.studentsSummary.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lesson Date</label>
                  <input
                    type="date"
                    value={lessonForm.date}
                    onChange={e => setLessonForm({ ...lessonForm, date: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <select
                    value={lessonForm.subject}
                    onChange={e => setLessonForm({ ...lessonForm, subject: e.target.value as Subject })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                  >
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic Taught</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.topic}
                    onChange={e => setLessonForm({ ...lessonForm, topic: e.target.value })}
                    placeholder="e.g. Stoichiometry"
                    className="w-full border rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  What Was Taught / Learning Objectives
                </label>
                <textarea
                  rows={2}
                  required
                  value={lessonForm.whatWasTaught}
                  onChange={e => setLessonForm({ ...lessonForm, whatWasTaught: e.target.value })}
                  placeholder="Covered molar mass calculations, empirical formula derivation..."
                  className="w-full border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Observed Struggles / Difficulties
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.struggles}
                  onChange={e => setLessonForm({ ...lessonForm, struggles: e.target.value })}
                  placeholder="Hesitated when converting grams to moles..."
                  className="w-full border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Understanding (1 - 5)
                  </label>
                  <select
                    value={lessonForm.understandingLevel}
                    onChange={e => setLessonForm({ ...lessonForm, understandingLevel: Number(e.target.value) as any })}
                    className="w-full border rounded-xl p-2.5 text-xs"
                  >
                    <option value={1}>1 - Lost / Major Intervention Needed</option>
                    <option value={2}>2 - Struggling</option>
                    <option value={3}>3 - Developing Understanding</option>
                    <option value={4}>4 - Solid Conceptual Grasp</option>
                    <option value={5}>5 - Mastered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Recommended Next Step
                  </label>
                  <input
                    type="text"
                    value={lessonForm.recommendedNextStep}
                    onChange={e => setLessonForm({ ...lessonForm, recommendedNextStep: e.target.value })}
                    placeholder="e.g. 5 practice problems on mole ratios"
                    className="w-full border rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogLessonModal(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLesson}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs"
                >
                  {isSavingLesson ? 'Saving...' : 'Save Lesson Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL 5: EDIT LEARNING PLAN MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {showEditPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-black text-xl text-slate-900">Update Learning Plan</h3>
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Next Recommended Action
                </label>
                <input
                  type="text"
                  required
                  value={planEditForm.nextRecommendedAction}
                  onChange={e => setPlanEditForm({ ...planEditForm, nextRecommendedAction: e.target.value })}
                  placeholder="e.g. Master balancing redox equations"
                  className="w-full border rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Subject Topic
                </label>
                <input
                  type="text"
                  required
                  value={planEditForm.currentTopic}
                  onChange={e => setPlanEditForm({ ...planEditForm, currentTopic: e.target.value })}
                  placeholder="e.g. Chemical Equilibrium"
                  className="w-full border rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={planEditForm.targetTopics}
                  onChange={e => setPlanEditForm({ ...planEditForm, targetTopics: e.target.value })}
                  placeholder="Topic A, Topic B, Topic C"
                  className="w-full border rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Areas Needing Improvement / Weak Topics
                </label>
                <input
                  type="text"
                  value={planEditForm.weakTopics}
                  onChange={e => setPlanEditForm({ ...planEditForm, weakTopics: e.target.value })}
                  placeholder="e.g. Electron Configuration, Le Chatelier's principle"
                  className="w-full border rounded-xl p-3 text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditPlanModal(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlan}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs"
                >
                  {isSavingPlan ? 'Saving...' : 'Save Learning Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
