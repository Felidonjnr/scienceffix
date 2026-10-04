import React, { useState } from 'react';
import { StudentData, ProfileLevel } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  User, 
  Target, 
  Calendar, 
  Shield, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface IntakeFormProps {
  onSubmit: (data: StudentData) => void;
  onDevSkip?: () => void;
}

export default function IntakeForm({ onSubmit, onDevSkip }: IntakeFormProps) {
  const [step, setStep] = useState<'intro' | 'profile'>('intro');

  const [data, setData] = useState<StudentData>({
    name: '',
    phone: '',
    age: '',
    courseGoal: '',
    targetExam: '',
    startingLevel: 'Z',
    employmentStatus: '',
    learningMethod: '',
    readingPace: '',
    dailyStudyHours: '',
    biggestChallenge: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────
            PHASE 1: ASSESSMENT INTRODUCTION
        ────────────────────────────────────────────────────────────── */}
        {step === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Header Banner */}
            <div className="bg-slate-900 text-white p-8 md:p-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Science Restart Assessment</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Science Restart Assessment
              </h1>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                A structured, non-judgmental diagnostic designed to evaluate your current science foundation across four core areas.
              </p>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              {/* Estimated Time Badge */}
              <div className="flex items-center gap-3 p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">Estimated Duration: ~15 minutes.</span>
                  <span className="text-slate-600 block mt-0.5">
                    Self-paced questions. Your assessment is processed in this session; a saved blueprint may remain on this device so you can return to it.
                  </span>
                </div>
              </div>

              {/* What This Is / Covers / Is For */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  What You Need to Know
                </h3>

                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-semibold">What it covers:</strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Foundational concepts in Mathematics, Physics, Chemistry, and Biology, testing practical and relational thinking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-semibold">What it is for:</strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Identifies where your foundation is solid, developing, or in need of rebuilding before entering your intended science program.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-semibold">What it is NOT:</strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        It is not an IQ test, not an entrance exam, and not designed to judge you. It is simply an academic baseline tool.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm text-base"
                >
                  <span>Begin Readiness Profile</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {onDevSkip && (
                  <button 
                    type="button"
                    onClick={onDevSkip}
                    className="w-full flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 border-dashed px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-100 transition-colors text-xs"
                  >
                    🧪 Dev: Auto-Fill & Skip to Blueprint
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              PHASE 2: READINESS PROFILE FORM
          ────────────────────────────────────────────────────────────── */
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="mb-10 border-b border-slate-100 pb-6">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Candidate Intake
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Build Your Science Readiness Profile
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
                Tell us a little about where you are now and where you want to go. This helps us interpret your assessment in realistic context.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* GROUP 1: ABOUT YOU */}
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  1. About You
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                      placeholder="e.g. Grace Adebayo"
                      value={data.name}
                      onChange={e => setData({...data, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Age</label>
                    <input 
                      required
                      type="number"
                      min={14}
                      max={80}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                      placeholder="e.g. 24"
                      value={data.age}
                      onChange={e => setData({...data, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Phone</label>
                    <input 
                      required
                      type="tel"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                      placeholder="e.g. 080..."
                      value={data.phone}
                      onChange={e => setData({...data, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Current Employment / Daily Status</label>
                  <select 
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                    value={data.employmentStatus}
                    onChange={e => setData({...data, employmentStatus: e.target.value})}
                  >
                    <option value="" disabled>Select your current situation</option>
                    <option value="Working full-time">Working full-time</option>
                    <option value="Working part-time">Working part-time / Freelance</option>
                    <option value="Full-time student">Full-time student</option>
                    <option value="Stay-at-home parent">Managing family / Stay-at-home parent</option>
                    <option value="Gap year / Returning to study">Gap year / Returning to study</option>
                  </select>
                </div>
              </div>

              {/* GROUP 2: YOUR LEARNING LIFE */}
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  2. Your Learning Life
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Daily Study Availability</label>
                  <select 
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                    value={data.dailyStudyHours}
                    onChange={e => setData({...data, dailyStudyHours: e.target.value})}
                  >
                    <option value="" disabled>How much focused time can you realistically invest daily?</option>
                    <option value="< 1 hour">Under 1 hour per day</option>
                    <option value="1-2 hours">1 to 2 hours per day</option>
                    <option value="3-4 hours">3 to 4 hours per day</option>
                    <option value="5+ hours">5+ hours per day (Full-time study mode)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Primary Learning Style Preference</label>
                  <select 
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                    value={data.learningMethod}
                    onChange={e => setData({...data, learningMethod: e.target.value})}
                  >
                    <option value="" disabled>How do you absorb complex information best?</option>
                    <option value="Visual">Visual (Diagrams, mental models, animations)</option>
                    <option value="Auditory">Auditory (Lectures, conversational explanations)</option>
                    <option value="Reading">Reading / Writing (Structured texts, note-taking)</option>
                    <option value="Kinesthetic">Practical Application (Worked problems, step-by-step exercises)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Reading Pattern & Comprehension Pace</label>
                  <select 
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                    value={data.readingPace}
                    onChange={e => setData({...data, readingPace: e.target.value})}
                  >
                    <option value="" disabled>Describe your typical reading approach</option>
                    <option value="Slow and thorough">Slow and thorough (I analyze every word and sentence)</option>
                    <option value="Average">Average pace (I read steadily, re-reading when stuck)</option>
                    <option value="Fast skimmer">Fast skimmer (I move quickly, sometimes missing details)</option>
                    <option value="Struggles with focus">Struggle with focus (Long paragraphs make my attention drift)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Biggest Study Barrier</label>
                  <select 
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                    value={data.biggestChallenge}
                    onChange={e => setData({...data, biggestChallenge: e.target.value})}
                  >
                    <option value="" disabled>What is your primary friction when learning science?</option>
                    <option value="Calculations">Calculations and math-heavy formulas</option>
                    <option value="Memory">Forgetting concepts shortly after studying</option>
                    <option value="Procrastination">Procrastination and getting started</option>
                    <option value="Test Anxiety">Exam anxiety and freezing up under pressure</option>
                    <option value="Time Management">Inconsistent schedule due to work and life</option>
                  </select>
                </div>
              </div>

              {/* GROUP 3: YOUR ACADEMIC DIRECTION */}
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  3. Your Academic Direction
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Target Career or Course</label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="text"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                        placeholder="e.g. Nursing, Pharmacy, Computer Science"
                        value={data.courseGoal}
                        onChange={e => setData({...data, courseGoal: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Target Examination / Milestone</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                        value={data.targetExam}
                        onChange={e => setData({...data, targetExam: e.target.value})}
                      >
                        <option value="" disabled>Select target milestone</option>
                        <option value="JAMB 2027">JAMB 2027</option>
                        <option value="JAMB 2028">JAMB 2028</option>
                        <option value="WAEC">WAEC (WASSCE)</option>
                        <option value="NECO">NECO</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Starting Level */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block">
                      Self-Assessed Science Baseline
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Choose the description that most accurately reflects your starting point.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { 
                        id: 'Z', 
                        title: 'Starting from the basics', 
                        desc: 'Rebuilding from the ground up (Arts, Commercial, or very little science memory)' 
                      },
                      { 
                        id: 'F', 
                        title: 'Some foundation, but significant gaps', 
                        desc: 'Studied science previously, but core formulas and principles are rusty or incomplete' 
                      },
                      { 
                        id: 'P', 
                        title: 'Comfortable with procedures and calculations', 
                        desc: 'Can apply formulas when given, but need deeper conceptual intuition to tackle unfamiliar problems' 
                      },
                      { 
                        id: 'C', 
                        title: 'Strong foundation seeking refinement', 
                        desc: 'Good grasp of concepts, looking to polish speed, edge cases, and exam-level application' 
                      },
                    ].map(level => (
                      <label 
                        key={level.id} 
                        className={`flex items-start gap-3.5 p-3.5 border rounded-xl cursor-pointer transition-all ${
                          data.startingLevel === level.id 
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="startingLevel" 
                          value={level.id}
                          checked={data.startingLevel === level.id}
                          onChange={(e) => setData({...data, startingLevel: e.target.value as ProfileLevel})}
                          className="mt-1 border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{level.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{level.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Reassurance */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold block mb-0.5">Privacy Reassurance:</strong>
                  Your assessment results are processed in your browser and saved locally on this device. The basic contact and pathway details you provide are sent to Science Restart Academy so we can understand prospective learners and follow up about the Academy. Be sure to save your Readiness Blueprint PDF when completed.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm text-base"
                >
                  <span>Proceed to Assessment Instructions</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('intro')}
                    className="hover:text-slate-800 underline"
                  >
                    &larr; Back to Introduction
                  </button>

                  {onDevSkip && (
                    <button 
                      type="button"
                      onClick={onDevSkip}
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      🧪 Dev Skip
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
