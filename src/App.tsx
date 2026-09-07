/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingView from './components/LandingView';
import IntakeForm from './components/IntakeForm';
import DiagnosticView from './components/DiagnosticView';
import ReportView from './components/ReportView';
import { StudentData, Answer } from './types';
import { QUESTIONS } from './data/questions';

export default function App() {
  const [step, setStep] = useState<'landing' | 'intake' | 'diagnostic' | 'report'>('landing');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleDevSkip = () => {
    const dummyStudent: StudentData = {
      name: 'Test Student (Auto-filled)',
      phone: '08000000000',
      age: '18-20',
      courseGoal: 'Medicine',
      targetExam: 'JAMB 2027',
      startingLevel: 'F',
      employmentStatus: 'Working full-time',
      learningMethod: 'Visual',
      readingPace: 'Fast skimmer',
      dailyStudyHours: '< 1 hour',
      biggestChallenge: 'Calculations'
    };

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const dummyAnswers: Answer[] = [];

    subjects.forEach(subject => {
      const subjectQuestions = QUESTIONS.filter(q => q.subject === subject);
      // Just pick 5 random questions for this subject
      const selected = subjectQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
      selected.forEach(q => {
        const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
        dummyAnswers.push({
          questionId: q.id,
          optionId: randomOption.id,
          points: randomOption.points,
          timeSpent: Math.floor(Math.random() * 120) + 10,
          confidence: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as "High" | "Medium" | "Low"
        });
      });
    });

    setStudent(dummyStudent);
    setAnswers(dummyAnswers);
    setStep('report');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {step === 'landing' && <LandingView onStart={() => setStep('intake')} />}
          
          {step === 'intake' && (
            <IntakeForm 
              onSubmit={(data) => {
                setStudent(data);
                setStep('diagnostic');
              }} 
              onDevSkip={handleDevSkip}
            />
          )}

          {step === 'diagnostic' && student && (
            <DiagnosticView 
              student={student}
              onComplete={(finalAnswers) => {
                setAnswers(finalAnswers);
                setStep('report');
              }} 
            />
          )}

          {step === 'report' && student && (
            <ReportView 
              student={student}
              answers={answers}
              onRestart={() => {
                setAnswers([]);
                setStudent(null);
                setStep('landing');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
