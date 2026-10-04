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
import { StudentData, Answer } from './types';
import { isCompleteAssessment } from './utils/engine';
import { QUESTIONS } from './data/questions';

type AcademySection = 'home' | 'academy' | 'programmes' | 'assessment' | 'learning' | 'pathways' | 'cohort' | 'portal';
type View = AcademySection | 'intake' | 'diagnostic' | 'report';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('science_transition_assessment_state');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.student && isCompleteAssessment(parsed.answers)) {
          setStudent(parsed.student);
          setAnswers(parsed.answers);
        }
      } catch (error) {
        console.error('Failed to parse saved assessment state', error);
      }
    }
    setIsLoaded(true);
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
      name: 'Test Student (Auto-filled)', phone: '08000000000', age: '18-20', courseGoal: 'Medicine', targetExam: 'JAMB 2027', startingLevel: 'F', employmentStatus: 'Working full-time', learningMethod: 'Visual', readingPace: 'Fast skimmer', dailyStudyHours: '< 1 hour', biggestChallenge: 'Calculations'
    };
    const dummyAnswers: Answer[] = [];
    ['Mathematics', 'Physics', 'Chemistry', 'Biology'].forEach(subject => {
      QUESTIONS.filter(q => q.subject === subject).sort(() => 0.5 - Math.random()).slice(0, 5).forEach(q => {
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

  if (!isLoaded) return null;

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
          {(['home', 'academy', 'programmes', 'assessment', 'learning', 'pathways', 'cohort', 'portal'] as AcademySection[]).includes(view as AcademySection) && academyView(view as AcademySection)}

          {view === 'intake' && <IntakeForm onSubmit={(data) => { setStudent(data); setView('diagnostic'); fetch('/api/interest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, phone: data.phone, ageRange: data.age, previousBackground: data.startingLevel, desiredPathway: data.courseGoal, scienceStatus: data.startingLevel, biggestChallenge: data.biggestChallenge, employmentStatus: data.employmentStatus, source: 'science-readiness-assessment' }) }).catch(() => undefined); }} onDevSkip={import.meta.env.DEV ? handleDevSkip : undefined} />}

          {view === 'diagnostic' && student && <DiagnosticView student={student} onComplete={(finalAnswers) => { setAnswers(finalAnswers); setView('report'); }} />}

          {view === 'report' && student && <ReportView student={student} answers={answers} onNavigateHome={() => setView('home')} onRestart={resetAssessment} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
