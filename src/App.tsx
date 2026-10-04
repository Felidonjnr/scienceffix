/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AcademyHome from './components/AcademyHome';
import IntakeForm from './components/IntakeForm';
import DiagnosticView from './components/DiagnosticView';
import ReportView from './components/ReportView';
import AdminDashboard from './components/AdminDashboard';
import { StudentData, Answer, Question } from './types';


type AcademySection = 'home' | 'academy' | 'programmes' | 'assessment' | 'pathways' | 'cohort';
type View = AcademySection | 'intake' | 'diagnostic' | 'report';

export default function App() {
  const [view, setView] = useState<View>(() => new URLSearchParams(window.location.search).get('admin') === '1' ? 'home' : 'home');
  const [isAdminRoute] = useState(() => new URLSearchParams(window.location.search).get('admin') === '1');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isAdminRoute) {
        setIsLoaded(true);
        return;
      }

      const savedData = localStorage.getItem('science_transition_assessment_state');
      try {
        const questionResponse = await fetch('/api/questions');
        if (questionResponse.ok) {
          const data = await questionResponse.json();
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestionBank(data.questions as Question[]);
          } else {
            const { QUESTIONS } = await import('./data/questions');
            setQuestionBank(QUESTIONS);
          }
        } else {
          const { QUESTIONS } = await import('./data/questions');
          setQuestionBank(QUESTIONS);
        }
      } catch (error) {
        console.error('Failed to load live question bank; using local fallback', error);
        const { QUESTIONS } = await import('./data/questions');
        setQuestionBank(QUESTIONS);
      }

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.student) {
            setStudent(parsed.student);
            setAnswers(parsed.answers);
          }
        } catch (error) {
          console.error('Failed to parse saved assessment state', error);
        }
      }
      setIsLoaded(true);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (student && answers.length > 0) {
      localStorage.setItem('science_transition_assessment_state', JSON.stringify({ student, answers }));
    }
  }, [student, answers]);

  const startAssessment = () => setView('intake');
  const viewBlueprint = () => setView('report');

  const handleDevSkip = () => {
    const dummyStudent: StudentData = {
      name: 'Test Student (Auto-filled)', phone: '08000000000', age: '18-20', courseGoal: 'Medicine', targetExam: 'JAMB / UTME', startingLevel: 'F', employmentStatus: 'Working full-time', learningMethod: 'Step-by-step explanation', readingPace: 'Understand with explanation', dailyStudyHours: '< 1 hour', biggestChallenge: 'Calculations'
    };
    const dummyAnswers: Answer[] = [];
    ['Mathematics', 'Physics', 'Chemistry', 'Biology'].forEach(subject => {
      questionBank.filter(q => q.subject === subject).sort(() => 0.5 - Math.random()).slice(0, 5).forEach(q => {
        const option = q.options[Math.floor(Math.random() * q.options.length)];
        dummyAnswers.push({ questionId: q.id, optionId: option.id, points: option.points, timeSpent: Math.floor(Math.random() * 120) + 10, confidence: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low' });
      });
    });
    setStudent(dummyStudent);
    setAnswers(dummyAnswers);
    setView('report');
  };

  const resetAssessment = () => {
    localStorage.removeItem('science_transition_assessment_state');
    setAnswers([]);
    setStudent(null);
    setView('home');
  };

  const pageVariants = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-5 w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-xs font-black tracking-[0.2em] text-blue-300 mb-2">SCIENCE RESTART ACADEMY</p>
          <h1 className="text-2xl font-black">Preparing your learning environment…</h1>
          <p className="text-slate-400 mt-3 text-sm">Loading the current diagnostic question bank.</p>
        </div>
      </div>
    );
  }

  if (questionBank.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-xs font-black tracking-[0.2em] text-blue-300 mb-2">SCIENCE RESTART ACADEMY</p>
          <h1 className="text-2xl font-black">The assessment is temporarily unavailable.</h1>
          <p className="text-slate-400 mt-3 text-sm">Please refresh in a moment. Your Academy account has not been affected.</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-5 py-3 rounded-xl bg-white text-slate-950 font-black">Try again</button>
        </div>
      </div>
    );
  }

  const academyView = (section: AcademySection) => (
    <AcademyHome
      section={section}
      onNavigate={setView}
      onStartAssessment={startAssessment}
      onViewBlueprint={viewBlueprint}
      hasBlueprint={Boolean(student && answers.length > 0)}
      studentName={student?.name}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={view} initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.22, ease: 'easeInOut' }} className="min-h-screen">
          {(['home', 'academy', 'programmes', 'assessment', 'pathways', 'cohort'] as AcademySection[]).includes(view as AcademySection) && academyView(view as AcademySection)}

          {view === 'intake' && <IntakeForm onSubmit={(data) => { setStudent(data); setView('diagnostic'); fetch('/api/interest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, phone: data.phone, ageRange: data.age, previousBackground: data.startingLevel, desiredPathway: data.courseGoal, scienceStatus: data.startingLevel, biggestChallenge: data.biggestChallenge, employmentStatus: data.employmentStatus, source: 'science-readiness-assessment' }) }).catch(() => undefined); }} onDevSkip={import.meta.env.DEV ? handleDevSkip : undefined} />}

          {view === 'diagnostic' && student && <DiagnosticView student={student} questionBank={questionBank} onComplete={(finalAnswers) => { setAnswers(finalAnswers); setView('report'); }} />}

          {view === 'report' && student && <ReportView student={student} answers={answers} questionBank={questionBank} onNavigateHome={() => setView('home')} onRestart={resetAssessment} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
