import { useState, useEffect } from 'react';
import { Subject, ProfileLevel, Answer, Question, StudentData, ConfidenceLevel } from '../types';
import { getQuestionsForSubjectAndLevel, evaluateSubjectLevel } from '../utils/engine';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

const SUBJECTS: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
const LEVELS: ProfileLevel[] = ['Z', 'F', 'P', 'C'];

export default function DiagnosticView({ student, onComplete }: { student: StudentData, onComplete: (answers: Answer[]) => void }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  const initialLevelIndex = LEVELS.indexOf(student.startingLevel || 'Z');
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(initialLevelIndex);
  const [qIndexInLevel, setQIndexInLevel] = useState(0);
  
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentSubject = SUBJECTS[subjectIndex];
  const currentLevel = LEVELS[levelIndex];

  // Derive current questions synchronously during render
  const currentQuestions = getQuestionsForSubjectAndLevel(currentSubject, currentLevel, student);

  // If for some reason we land on a level with no questions, advance it (using useEffect to avoid render warnings)
  useEffect(() => {
    if (currentQuestions.length === 0) {
      if (subjectIndex < SUBJECTS.length - 1) {
        setSubjectIndex(s => s + 1);
        setLevelIndex(initialLevelIndex);
      } else {
        onComplete(answers);
      }
    }
  }, [currentQuestions.length, subjectIndex, answers, onComplete, initialLevelIndex]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOptionId(null);
  }, [subjectIndex, levelIndex, qIndexInLevel]);

  const handleConfidenceSelect = (confidence: ConfidenceLevel) => {
    if (!selectedOptionId) return;
    const currentQ = currentQuestions[qIndexInLevel];
    const option = currentQ.options.find(o => o.id === selectedOptionId)!;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const newAnswer = { questionId: currentQ.id, optionId: option.id, points: option.points, timeSpent, confidence };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (qIndexInLevel < currentQuestions.length - 1) {
      setQIndexInLevel(qIndexInLevel + 1);
    } else {
      const evaluation = evaluateSubjectLevel(newAnswers, currentQuestions);
      
      if (evaluation.passed && levelIndex < LEVELS.length - 1) {
        setLevelIndex(levelIndex + 1);
        setQIndexInLevel(0);
      } else {
        if (subjectIndex < SUBJECTS.length - 1) {
          setSubjectIndex(subjectIndex + 1);
          setLevelIndex(initialLevelIndex);
          setQIndexInLevel(0);
        } else {
          onComplete(newAnswers);
        }
      }
    }
  };

  if (currentQuestions.length === 0) {
    return null; // Don't render empty state while useEffect advances
  }

  const currentQ = currentQuestions[qIndexInLevel];
  const progressPercent = (subjectIndex / SUBJECTS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{currentSubject} • Health Scan</h2>
            <p className="text-2xl font-bold mt-1 text-[#0F172A] tracking-tight">Question {qIndexInLevel + 1}</p>
          </div>
          <div className="text-sm font-medium text-[#64748B]">
            Subject {subjectIndex + 1} of {SUBJECTS.length}
          </div>
        </div>
        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#2563EB] h-full transition-all duration-500 ease-out" 
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="inline-block px-2 py-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded text-[10px] font-bold uppercase tracking-wider">
              Topic: {currentQ.topic}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              <Clock className="w-3.5 h-3.5" />
              Tracking
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight leading-relaxed mb-8">
            {currentQ.text}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all group flex items-start gap-4 ${
                  selectedOptionId === opt.id 
                    ? 'border-[#2563EB] bg-blue-50 ring-2 ring-blue-500/20' 
                    : 'border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOptionId === opt.id ? 'border-[#2563EB]' : 'border-[#CBD5E1] group-hover:border-[#2563EB]'
                }`}>
                  <div className={`w-2 h-2 rounded-full transition-opacity ${
                    selectedOptionId === opt.id ? 'bg-[#2563EB] opacity-100' : 'bg-[#2563EB] opacity-0 group-hover:opacity-100'
                  }`} />
                </div>
                <span className={`text-sm font-medium leading-relaxed ${selectedOptionId === opt.id ? 'text-[#0F172A]' : 'text-[#1E293B]'}`}>
                  {opt.text}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedOptionId && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-sm font-bold text-slate-700 mb-3 text-center">How confident are you in this answer?</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleConfidenceSelect('Low')}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-red-100 hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      <span className="text-xs font-bold text-slate-600">Low (Guess)</span>
                    </button>
                    <button 
                      onClick={() => handleConfidenceSelect('Medium')}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-yellow-100 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                    >
                      <Shield className="w-5 h-5 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-600">Medium</span>
                    </button>
                    <button 
                      onClick={() => handleConfidenceSelect('High')}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-green-100 hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      <span className="text-xs font-bold text-slate-600">High (Sure)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
