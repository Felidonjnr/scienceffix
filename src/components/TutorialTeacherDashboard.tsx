import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  User,
  X
} from 'lucide-react';
import {
  AssignmentQuestionItem,
  StudentAssignment,
  TeacherDashboardData
} from '../types/studentPortal';
import { Subject } from '../types';

export default function TutorialTeacherDashboard() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem('sciencefix_teacher_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);
  const [isLoadingStudentAssignments, setIsLoadingStudentAssignments] = useState(false);

  // Create Assignment Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    subject: 'Chemistry' as Subject,
    topic: '',
    count: 5,
    dueDateDays: 3,
    instructions: 'Complete these questions carefully. Results will be reviewed in our next physical lesson.'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftQuestions, setDraftQuestions] = useState<AssignmentQuestionItem[]>([]);
  const [draftBase, setDraftBase] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const getHeaders = () => ({
    'x-admin-key': adminKey.trim(),
    'Content-Type': 'application/json'
  });

  const loadDashboard = async () => {
    if (!adminKey.trim()) {
      setError('Enter your teacher access key.');
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
        throw new Error('Unexpected response format from server.');
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate teacher workspace.');
      }
      setDashboardData(data);
      setIsAuthenticated(true);
      sessionStorage.setItem('sciencefix_teacher_key', adminKey.trim());

      // If no student selected yet, auto-select first student
      if (!selectedStudentId && data.studentsSummary && data.studentsSummary.length > 0) {
        const firstStudent = data.studentsSummary[0];
        setSelectedStudentId(firstStudent.id);
        void loadStudentAssignments(firstStudent.id);
      } else if (selectedStudentId) {
        void loadStudentAssignments(selectedStudentId);
      }
    } catch (err: any) {
      setError(err?.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentAssignments = async (studentId: string) => {
    if (!studentId) return;
    setIsLoadingStudentAssignments(true);
    try {
      const res = await fetch(`/api/tutorial/teacher/students/${studentId}`, { headers: getHeaders() });
      if (res.ok) {
        const detail = await res.json();
        setStudentAssignments(detail.assignments || []);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to load student assignments.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading student assignments.');
    } finally {
      setIsLoadingStudentAssignments(false);
    }
  };

  useEffect(() => {
    if (adminKey.trim()) {
      void loadDashboard();
    }
  }, []);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowCreateForm(false);
    setDraftQuestions([]);
    setDraftBase(null);
    void loadStudentAssignments(studentId);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('sciencefix_teacher_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setDashboardData(null);
    setSelectedStudentId('');
    setStudentAssignments([]);
    setShowCreateForm(false);
  };

  // Generate Draft Questions
  const handleGenerateDraft = async () => {
    if (!selectedStudentId) {
      setError('Please select a student first.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    setActionSuccessMsg(null);
    try {
      const res = await fetch('/api/tutorial/teacher/assignment-draft', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedStudentId,
          subject: assignmentForm.subject,
          topic: assignmentForm.topic,
          count: assignmentForm.count
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate assignment draft.');
      setDraftBase(data.assignment);
      setDraftQuestions(data.assignment.questions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Assignment (as Draft or Publish)
  const handleSaveAssignment = async (asDraft: boolean) => {
    if (!draftBase || !draftQuestions.length || !selectedStudentId) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        ...draftBase,
        title: `${assignmentForm.topic || assignmentForm.subject} Assignment`,
        subject: assignmentForm.subject,
        topic: assignmentForm.topic || draftBase.topic,
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

      setActionSuccessMsg(asDraft ? 'Assignment saved as draft.' : 'Assignment published successfully.');
      setTimeout(() => {
        setShowCreateForm(false);
        setDraftBase(null);
        setDraftQuestions([]);
        setActionSuccessMsg(null);
      }, 1200);

      await loadStudentAssignments(selectedStudentId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish existing draft
  const handlePublishDraft = async (assignmentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tutorial/teacher/assignments/${assignmentId}/publish`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish draft.');
      await loadStudentAssignments(selectedStudentId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────── 1. LOGIN SCREEN ────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <KeyRound className="w-5 h-5" />
            <h1 className="text-lg font-bold text-slate-900">Teacher Portal Login</h1>
          </div>
          <p className="text-xs text-slate-600 mb-6">
            Enter your teacher access key to manage students and assignments.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              void loadDashboard();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Access Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter access key"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold transition"
            >
              {isLoading ? 'Verifying…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const students = dashboardData?.studentsSummary || [];
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // ──────────────────────────── 2. MAIN TEACHER WORKSPACE ────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900">ScienceFix Teacher Portal</h1>
            <p className="text-xs text-slate-500">Student & Assignment Management</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                void loadDashboard();
                if (selectedStudentId) void loadStudentAssignments(selectedStudentId);
              }}
              disabled={isLoading}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Alerts / Error display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* ── SECTION 1: STUDENT SELECTION ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <label htmlFor="student-select" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Select Student
              </label>
              <p className="text-xs text-slate-500">Choose a student to view and manage their assignments.</p>
            </div>

            {selectedStudent && (
              <button
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setDraftQuestions([]);
                  setDraftBase(null);
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition"
              >
                <Plus className="w-3.5 h-3.5" />
                {showCreateForm ? 'Cancel Creation' : 'Create Assignment'}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <select
              id="student-select"
              value={selectedStudentId}
              onChange={e => handleSelectStudent(e.target.value)}
              className="w-full sm:w-80 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            >
              {students.length === 0 ? (
                <option value="">No students available</option>
              ) : (
                students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.currentSubject ? `(${s.currentSubject})` : ''}
                  </option>
                ))
              )}
            </select>

            {selectedStudent && (
              <div className="text-xs text-slate-600 flex items-center gap-3 w-full sm:w-auto">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Goal:</strong> {selectedStudent.goal || 'General Science'}
                </span>
                <span>•</span>
                <span>
                  <strong>PIN:</strong> {selectedStudent.accessCode || '—'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 2: CREATE ASSIGNMENT FORM (when toggled) ── */}
        {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                New Assignment for {selectedStudent?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Select topic, subject, and question count, then generate and publish.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                <select
                  value={assignmentForm.subject}
                  onChange={e => setAssignmentForm({ ...assignmentForm, subject: e.target.value as Subject })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={assignmentForm.topic}
                  onChange={e => setAssignmentForm({ ...assignmentForm, topic: e.target.value })}
                  placeholder="e.g. Atomic Structure"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Number of Questions</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={assignmentForm.count}
                  onChange={e => setAssignmentForm({ ...assignmentForm, count: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Instructions for Student</label>
              <input
                type="text"
                value={assignmentForm.instructions}
                onChange={e => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
              >
                {isGenerating ? 'Preparing Questions…' : 'Generate Question Set'}
              </button>
            </div>

            {/* Questions preview & editing */}
            {draftQuestions.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800">
                    Prepared Questions ({draftQuestions.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">Edit or remove questions before saving</span>
                </div>

                <div className="space-y-3">
                  {draftQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-600">Q{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setDraftQuestions(draftQuestions.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-600 transition"
                          title="Remove question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={q.text}
                        onChange={e => {
                          const updated = [...draftQuestions];
                          updated[idx].text = e.target.value;
                          setDraftQuestions(updated);
                        }}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                      />

                      {/* Options */}
                      <div className="space-y-1">
                        {q.options?.map(opt => {
                          const isCorrect = opt.id === q.correctOptionId;
                          return (
                            <div
                              key={opt.id}
                              className={`flex items-center gap-2 p-1.5 rounded text-xs ${
                                isCorrect ? 'bg-emerald-50 text-emerald-900 font-medium' : 'bg-white text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {isCorrect ? '✓' : '•'}
                              </span>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={e => {
                                  const updated = [...draftQuestions];
                                  const targetOpt = updated[idx].options.find(o => o.id === opt.id);
                                  if (targetOpt) targetOpt.text = e.target.value;
                                  setDraftQuestions(updated);
                                }}
                                className="w-full bg-transparent text-xs focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final save buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void handleSaveAssignment(true)}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void handleSaveAssignment(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSaving ? 'Publishing…' : 'Publish Assignment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 3: ASSIGNMENT LIST FOR SELECTED STUDENT ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Assignments ({studentAssignments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Existing assignments for {selectedStudent ? selectedStudent.name : 'selected student'}.
              </p>
            </div>
            {isLoadingStudentAssignments && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading…
              </span>
            )}
          </div>

          {studentAssignments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No assignments found for this student. Click "Create Assignment" above to prepare one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentAssignments.map(assign => (
                <div key={assign.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {assign.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          assign.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : assign.status === 'draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {assign.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {assign.questions?.length || 0} questions
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900">{assign.title}</h3>
                    <p className="text-xs text-slate-500">{assign.topic}</p>
                    {assign.teacherFeedback && (
                      <p className="text-xs text-blue-700 mt-1">
                        <strong>Feedback:</strong> {assign.teacherFeedback}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {assign.status === 'completed' && assign.percentage != null && (
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-700">
                          {assign.percentage}%
                        </span>
                        <span className="block text-[10px] text-slate-400">Score</span>
                      </div>
                    )}

                    {assign.status === 'draft' && (
                      <button
                        onClick={() => void handlePublishDraft(assign.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Publish Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
