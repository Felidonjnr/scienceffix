const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "import { useState } from 'react';";
const replacement = "import { useState, useEffect } from 'react';";

code = code.replace(target, replacement);

const targetState = `  const [step, setStep] = useState<'landing' | 'intake' | 'diagnostic' | 'report'>('landing');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);`;

const replacementState = `  const [step, setStep] = useState<'landing' | 'intake' | 'diagnostic' | 'report'>('landing');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('clinical_diagnostic_state');
    if (savedData) {
      try {
        const { student: savedStudent, answers: savedAnswers } = JSON.parse(savedData);
        if (savedStudent && savedAnswers && savedAnswers.length > 0) {
          setStudent(savedStudent);
          setAnswers(savedAnswers);
          setStep('report');
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever report is reached
  useEffect(() => {
    if (step === 'report' && student && answers.length > 0) {
      localStorage.setItem('clinical_diagnostic_state', JSON.stringify({ student, answers }));
    }
  }, [step, student, answers]);`;

code = code.replace(targetState, replacementState);

const renderTarget = `  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">`;

const renderReplacement = `  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">`;

code = code.replace(renderTarget, renderReplacement);

// Restart functionality update to clear local storage
const restartTarget = `              onRestart={() => {
                setAnswers([]);
                setStudent(null);
                setStep('landing');
              }}`;

const restartReplacement = `              onRestart={() => {
                localStorage.removeItem('clinical_diagnostic_state');
                setAnswers([]);
                setStudent(null);
                setStep('landing');
              }}`;

code = code.replace(restartTarget, restartReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with localStorage");
