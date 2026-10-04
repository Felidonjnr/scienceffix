import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Check, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  AlertCircle,
  MessageCircle,
  FileText,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FOUNDING_COHORT_CONFIG, getCohortStatusInfo } from '../data/cohortConfig';
import { StudentData, FoundingCohortApplication } from '../types';

interface CohortApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentData | null;
  assessmentScore?: number;
  onTakeAssessment?: () => void;
  onNavigateHome?: () => void;
}

export default function CohortApplicationModal({
  isOpen,
  onClose,
  student,
  assessmentScore,
  onTakeAssessment,
  onNavigateHome
}: CohortApplicationModalProps) {
  const statusInfo = getCohortStatusInfo(FOUNDING_COHORT_CONFIG.applicationStatus);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State
  const [form, setForm] = useState({
    // Step 1: Personal & Direction
    fullName: '',
    phone: '',
    email: '',
    previousBackground: 'Non-Science (Arts or Commercial)',
    secondaryCompletionYear: '2019 – 2022',
    intendedPathway: 'Nursing',
    intendedExam: 'JAMB / UTME',
    
    // Step 2: Science Foundation & Motivation
    currentFoundation: 'I have little or no science foundation.',
    mostDifficultSubject: 'Mathematics',
    mainReason: '',
    targetOutcome: 'Build a usable, intuitive understanding of core science principles',

    // Step 3: Commitment & Schedule
    currentStatus: 'Working full-time',
    weeklyStudyHours: '5 to 10 hours per week (Evening / Weekend)',
    schedulingNotes: ''
  });

  // Pre-fill form from student assessment data if available
  useEffect(() => {
    if (student) {
      setForm(prev => ({
        ...prev,
        fullName: student.name || prev.fullName,
        phone: student.phone || prev.phone,
        intendedPathway: student.courseGoal || prev.intendedPathway,
        intendedExam: student.targetExam || prev.intendedExam,
        weeklyStudyHours: student.dailyStudyHours 
          ? `${student.dailyStudyHours} (Based on assessment profile)`
          : prev.weeklyStudyHours
      }));
    }
  }, [student]);

  if (!isOpen) return null;

  // Validation per step
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      errors.fullName = "Please enter your name.";
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      errors.phone = "Please provide a valid phone number.";
    }
    if (!form.intendedPathway.trim()) {
      errors.intendedPathway = "Please select your intended academic pathway.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.currentFoundation.trim()) {
      errors.currentFoundation = "Please select your current science foundation level.";
    }
    if (!form.mainReason.trim() || form.mainReason.trim().length < 10) {
      errors.mainReason = "Tell us briefly why you want to rebuild your science foundation (at least a sentence).";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.weeklyStudyHours.trim()) {
      errors.weeklyStudyHours = "Please select your approximate weekly study availability.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setValidationErrors({});
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const applicationRecord: FoundingCohortApplication = {
      id: `sta-app-${Date.now()}`,
      identity: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined
      },
      academicBackground: {
        previousBackground: form.previousBackground,
        secondaryCompletionYear: form.secondaryCompletionYear
      },
      academicGoal: {
        intendedPathway: form.intendedPathway,
        intendedExam: form.intendedExam
      },
      scienceBackground: {
        currentFoundation: form.currentFoundation,
        mostDifficultSubject: form.mostDifficultSubject
      },
      motivation: {
        mainReason: form.mainReason.trim(),
        targetOutcome: form.targetOutcome
      },
      availability: {
        currentStatus: form.currentStatus,
        weeklyStudyHours: form.weeklyStudyHours,
        schedulingNotes: form.schedulingNotes.trim() || undefined
      },
      assessmentContext: student ? {
        completed: true,
        baselineScore: assessmentScore !== undefined ? Math.round(assessmentScore) : undefined,
        courseGoal: student.courseGoal,
        timestamp: new Date().toISOString()
      } : {
        completed: false
      },
      submittedAt: new Date().toISOString(),
      cohortCode: FOUNDING_COHORT_CONFIG.cohortCode,
      status: FOUNDING_COHORT_CONFIG.applicationStatus
    };

    try {
      const existing = JSON.parse(localStorage.getItem('sta_founding_cohort_applications') || '[]');
      existing.push(applicationRecord);
      localStorage.setItem('sta_founding_cohort_applications', JSON.stringify(existing));
    } catch {
      // LocalStorage access fallback
    }

    setIsSubmitted(true);
  };

  const getWhatsAppHandoffUrl = () => {
    const message = `Hello Science Transition Academy! My name is ${form.fullName}. I have submitted my application for the Founding Cohort (Target Pathway: ${form.intendedPathway}, Science Foundation: ${form.currentFoundation}). I would like to confirm my submission and inquire about the next review step.`;
    return `https://wa.me/${FOUNDING_COHORT_CONFIG.contactWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setValidationErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-8 shadow-2xl relative border border-slate-200 my-6 max-h-[92vh] overflow-y-auto flex flex-col justify-between"
      >
        {/* Close Button */}
        <button 
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close Application Window"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header / Status Banner */}
            <div className="mb-6 border-b border-slate-100 pb-5 pr-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeColor}`}>
                  {statusInfo.badgeText}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {FOUNDING_COHORT_CONFIG.cohortCode}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {statusInfo.modalTitle}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {statusInfo.statusNotice} Tell us about your background and target goals.
              </p>

              {/* Assessment Connection Notification */}
              {student ? (
                <div className="mt-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Science Readiness Assessment completed</span>
                    <span className="text-blue-700">
                      Your profile and baseline assessment are connected to this application.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Compass className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Not sure where your science foundation currently stands?</span>
                  </div>
                  {onTakeAssessment && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onTakeAssessment();
                      }}
                      className="font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap self-end sm:self-auto"
                    >
                      Take Assessment &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Progress Steps Header */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              </div>
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mt-1.5">
                <span className={currentStep === 1 ? 'text-blue-700 font-bold' : ''}>1. You & Direction</span>
                <span className={currentStep === 2 ? 'text-blue-700 font-bold' : ''}>2. Science & Goals</span>
                <span className={currentStep === 3 ? 'text-blue-700 font-bold' : ''}>3. Commitment</span>
              </div>
            </div>

            {/* Step Form Content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ──────────────── STEP 1 ──────────────── */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Samuel Okafor"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:ring-1 outline-none transition-colors ${
                        validationErrors.fullName 
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-400' 
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600 bg-white'
                      }`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{validationErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Phone Number (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 08012345678"
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:ring-1 outline-none transition-colors ${
                          validationErrors.phone 
                            ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-400' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600 bg-white'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{validationErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input 
                        type="email" 
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. samuel@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Academic Background
                      </label>
                      <select
                        value={form.previousBackground}
                        onChange={(e) => setForm({ ...form, previousBackground: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                      >
                        <option value="Non-Science (Arts or Commercial)">Non-Science (Arts or Commercial)</option>
                        <option value="Science background (forgotten / rusty)">Science background (forgotten / rusty)</option>
                        <option value="Incomplete secondary science">Incomplete secondary science</option>
                        <option value="Adult returning to study after years away">Adult returning to study after years away</option>
                        <option value="Other">Other educational background</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Year Finished Secondary School
                      </label>
                      <select
                        value={form.secondaryCompletionYear}
                        onChange={(e) => setForm({ ...form, secondaryCompletionYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                      >
                        <option value="Before 2015">Before 2015 (10+ years ago)</option>
                        <option value="2015 – 2018">2015 – 2018</option>
                        <option value="2019 – 2022">2019 – 2022</option>
                        <option value="2023 – 2025">2023 – 2025 (Recent graduate)</option>
                        <option value="Currently in school / Other">Currently in school / Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Intended Academic Pathway <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.intendedPathway}
                        onChange={(e) => setForm({ ...form, intendedPathway: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                      >
                        <option value="Nursing">Nursing</option>
                        <option value="Medical / Health Science">Medical / Health Science</option>
                        <option value="Laboratory / Applied Science">Laboratory / Applied Science</option>
                        <option value="Education">Education (Science)</option>
                        <option value="Technology / Computing">Technology / Computing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Other science-related pathway">Other science-related pathway</option>
                        <option value="I'm still deciding">I'm still deciding</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Target Examination <span className="text-slate-400 font-normal">(if applicable)</span>
                      </label>
                      <select
                        value={form.intendedExam}
                        onChange={(e) => setForm({ ...form, intendedExam: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                      >
                        <option value="JAMB / UTME">JAMB / UTME</option>
                        <option value="WAEC / NECO / GCE">WAEC / NECO / GCE</option>
                        <option value="College of Nursing / Entrance Exam">College of Nursing / Entrance Exam</option>
                        <option value="University Diploma / Transfer">University Diploma / Transfer</option>
                        <option value="Professional Certification">Professional Certification</option>
                        <option value="None / General Foundation Only">None / General Foundation Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Continue to Science Background</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ──────────────── STEP 2 ──────────────── */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      How would you describe your current science foundation? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        "I have little or no science foundation.",
                        "I studied science before but have forgotten much of it.",
                        "I understand some basics but have significant gaps.",
                        "I can handle basic science but struggle with deeper concepts.",
                        "I feel reasonably confident but want structured preparation."
                      ].map((desc, dIdx) => (
                        <label 
                          key={dIdx}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            form.currentFoundation === desc 
                              ? 'border-blue-600 bg-blue-50/50 text-slate-900 font-medium' 
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="currentFoundation"
                            value={desc}
                            checked={form.currentFoundation === desc}
                            onChange={(e) => setForm({ ...form, currentFoundation: e.target.value })}
                            className="mt-0.5 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Which science subject feels most difficult?
                    </label>
                    <select
                      value={form.mostDifficultSubject}
                      onChange={(e) => setForm({ ...form, mostDifficultSubject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                    >
                      <option value="Mathematics">Mathematics (Calculations, Formulas, Graphs)</option>
                      <option value="Physics">Physics (Mechanics, Forces, Quantitative Problems)</option>
                      <option value="Chemistry">Chemistry (Reactions, Equations, Atomic Concepts)</option>
                      <option value="Biology">Biology (Systems, Terminology, Detail)</option>
                      <option value="All of them feel challenging">All of them feel challenging right now</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      What is the main reason you want to rebuild your science foundation now? <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      rows={3}
                      value={form.mainReason}
                      onChange={(e) => setForm({ ...form, mainReason: e.target.value })}
                      placeholder="Share your personal or professional goal, why rebuilding your foundation matters right now, and what you hope to achieve..."
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:ring-1 outline-none transition-colors resize-none ${
                        validationErrors.mainReason 
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-400' 
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600 bg-white'
                      }`}
                    />
                    {validationErrors.mainReason && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{validationErrors.mainReason}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      What are you hoping to achieve through the programme?
                    </label>
                    <select
                      value={form.targetOutcome}
                      onChange={(e) => setForm({ ...form, targetOutcome: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                    >
                      <option value="Build a usable, intuitive understanding of core science principles">
                        Build a usable, intuitive understanding of core science principles
                      </option>
                      <option value="Gain confidence to pass entry examinations without rote cramming">
                        Gain confidence to pass entry examinations without rote cramming
                      </option>
                      <option value="Bridge from a non-science background into nursing or healthcare">
                        Bridge from a non-science background into nursing or healthcare
                      </option>
                      <option value="Overcome math and formula anxiety in science topics">
                        Overcome math and formula anxiety in science topics
                      </option>
                      <option value="Prepare for university-level science courses">
                        Prepare for university-level science courses
                      </option>
                    </select>
                  </div>

                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-2/3 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Continue to Commitment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ──────────────── STEP 3 ──────────────── */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Current Work / Life Status
                    </label>
                    <select
                      value={form.currentStatus}
                      onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                    >
                      <option value="Working full-time">Working full-time</option>
                      <option value="Working part-time / self-employed">Working part-time / self-employed</option>
                      <option value="Full-time student / learner">Full-time student / learner</option>
                      <option value="Not currently employed / in career transition">Not currently employed / in career transition</option>
                      <option value="Caregiver / Managing family">Caregiver / Managing family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      How much time can you realistically dedicate to learning each week? <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      The Academy is designed around real adult schedules. Choose a realistic pace you can sustain:
                    </p>
                    <div className="space-y-2">
                      {[
                        "3 to 5 hours per week (Light / Consistent)",
                        "5 to 10 hours per week (Evening / Weekend - Recommended)",
                        "10 to 15 hours per week (Dedicated Study)",
                        "15+ hours per week (Intensive)"
                      ].map((hrs, hIdx) => (
                        <label 
                          key={hIdx}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            form.weeklyStudyHours.startsWith(hrs.slice(0, 15))
                              ? 'border-blue-600 bg-blue-50/50 text-slate-900 font-medium' 
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="weeklyStudyHours"
                            value={hrs}
                            checked={form.weeklyStudyHours.startsWith(hrs.slice(0, 15))}
                            onChange={(e) => setForm({ ...form, weeklyStudyHours: e.target.value })}
                            className="mt-0.5 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{hrs}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Any Important Scheduling Consideration <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input 
                      type="text" 
                      value={form.schedulingNotes}
                      onChange={(e) => setForm({ ...form, schedulingNotes: e.target.value })}
                      placeholder="e.g. Prefer weekday evenings after 6 PM, free on Saturday mornings..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <strong className="text-slate-900 block font-semibold">Admissions Notice:</strong>
                    <p className="leading-relaxed">
                      Submitting this application allows our team to review your background and target goals. It does not automatically enroll you or reserve a seat until admissions details are confirmed.
                    </p>
                  </div>

                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{statusInfo.submitButtonText}</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
          </div>
        ) : (
          /* ──────────────── SUCCESS SCREEN ──────────────── */
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 sm:py-8 space-y-5"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Submission Recorded
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Application Received
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Thank you for your interest in the Science Transition Academy Founding Cohort, <strong>{form.fullName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>What Happens Next</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                We will review your background ({form.intendedPathway} pathway) and contact you about the next step before cohort admissions finalize.
              </p>
              <p className="leading-relaxed text-slate-500 italic">
                *Submissions are reviewed individually to ensure instructional fit and scheduling compatibility.
              </p>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-2 max-w-md mx-auto space-y-3">
              <a
                href={getWhatsAppHandoffUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Continue on WhatsApp</span>
              </a>

              {!student && onTakeAssessment && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onTakeAssessment();
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors shadow-xs"
                >
                  Take Science Readiness Assessment (15 mins)
                </button>
              )}

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors"
              >
                {student ? 'Back to My Readiness Blueprint' : 'Close and Return to Academy'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
