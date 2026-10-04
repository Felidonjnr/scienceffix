import React, { useEffect, useState, useMemo } from 'react';
import { StudentData, Answer } from '../types';
import { computeReport } from '../utils/engine';
import { 
  FileText, 
  Download, 
  BookOpen, 
  ListTodo, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles, 
  UserCheck, 
  Clock, 
  BrainCircuit, 
  ShieldAlert, 

  ChevronRight, 
  Search, 
  Home, 
  ArrowRight, 
  MessageCircle, 
  X, 
  Send,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { QUESTIONS } from '../data/questions';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { FOUNDING_COHORT_CONFIG, getCohortStatusInfo } from '../data/cohortConfig';
import CohortApplicationModal from './CohortApplicationModal';

interface AIAnalysis {
  hiddenBottleneck: string;
  unfairAdvantage: string[];
  sevenDayBlueprint: string[];
  fourMonthPrescription?: string[];
}

export default function ReportView({ 
  student, 
  answers, 
  onRestart,
  onNavigateHome 
}: { 
  student: StudentData; 
  answers: Answer[]; 
  onRestart: () => void;
  onNavigateHome?: () => void;
}) {
  const [report, setReport] = useState<ReturnType<typeof computeReport> | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [clinicalInsight, setClinicalInsight] = useState<{highLevelSummary: string, technicalBreakdown: string} | null>(null);
  const [insightMode, setInsightMode] = useState<'highLevel' | 'technical'>('highLevel');
  const [roadmapMode, setRoadmapMode] = useState<'weekly' | '4month'>('4month');
  const [isInsightLoading, setIsInsightLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [quickReviewContent, setQuickReviewContent] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  
  const statusInfo = getCohortStatusInfo(FOUNDING_COHORT_CONFIG.applicationStatus);

  // Founding Cohort In-Report Application State
  const [cohortModalOpen, setCohortModalOpen] = useState(false);

  const studyPlanTopics = useMemo(() => {
    if (!answers.length) return [];

    const topicStats: Record<string, { topic: string, subject: string, earned: number, max: number }> = {};

    answers.forEach(ans => {
      const q = QUESTIONS.find(q => q.id === ans.questionId);
      if (!q) return;

      const maxQPoints = Math.max(...q.options.map(o => o.points));
      
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { topic: q.topic, subject: q.subject, earned: 0, max: 0 };
      }
      
      topicStats[q.topic].earned += ans.points;
      topicStats[q.topic].max += maxQPoints;
    });

    const ranked = Object.values(topicStats).map(stat => ({
      ...stat,
      percentage: stat.max > 0 ? (stat.earned / stat.max) * 100 : 0
    })).sort((a, b) => a.percentage - b.percentage);

    return ranked.filter(t => t.percentage < 100);
  }, [answers]);

  const subjectInsights = useMemo(() => {
    if (!answers.length) return null;
    const insights: Record<string, { strengths: string[], needsImprovement: string[] }> = {
      Mathematics: { strengths: [], needsImprovement: [] },
      Physics: { strengths: [], needsImprovement: [] },
      Chemistry: { strengths: [], needsImprovement: [] },
      Biology: { strengths: [], needsImprovement: [] }
    };

    const topicStats: Record<string, { topic: string, subject: string, earned: number, max: number }> = {};
    answers.forEach(ans => {
      const q = QUESTIONS.find(q => q.id === ans.questionId);
      if (!q) return;
      const maxQPoints = Math.max(...q.options.map(o => o.points));
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { topic: q.topic, subject: q.subject, earned: 0, max: 0 };
      }
      topicStats[q.topic].earned += ans.points;
      topicStats[q.topic].max += maxQPoints;
    });

    Object.values(topicStats).forEach(stat => {
      const percentage = stat.max > 0 ? (stat.earned / stat.max) * 100 : 0;
      if (percentage >= 70) {
        insights[stat.subject].strengths.push(stat.topic);
      } else {
        insights[stat.subject].needsImprovement.push(stat.topic);
      }
    });

    return insights;
  }, [answers]);

  
  const pathologyData = useMemo(() => {
    if (!report?.cognitivePathology) return [];
    return Object.entries(report.cognitivePathology as Record<string, {score: number}>).map(([skill, data]) => ({
      skill,
      score: data.score
    })).sort((a, b) => b.score - a.score);
  }, [report]);
  
  const behavioral = report?.behavioralMetrics;


  const handleTaskClick = async (task: string) => {
    setSelectedTask(task);
    setQuickReviewContent(null);
    setIsReviewLoading(true);
    try {
      const response = await fetch('/api/quick-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      if (response.ok) {
        const data = await response.json();
        setQuickReviewContent(data.reviewContent);
      }
    } catch (error) {
      console.error("Failed to fetch quick review", error);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    const opt = {
      margin:       0.2,
      filename:     `${student.name.replace(/\s+/g, "_")}_Science_Readiness_Blueprint.pdf`,
      image:        { type: "jpeg" as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: "in", format: "letter", orientation: "portrait" as const }
    };
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    const generatedReport = computeReport(answers);
    setReport(generatedReport);
    window.scrollTo(0, 0);

    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            student,
            answers,
            report: generatedReport
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAiAnalysis(data);
        }
      } catch (error) {
        console.error("Failed to fetch AI analysis", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchAnalysis();

    const fetchClinicalInsight = async () => {
      try {
        const response = await fetch('/api/learning-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        if (response.ok) {
          const data = await response.json();
          setClinicalInsight({ highLevelSummary: data.highLevelSummary, technicalBreakdown: data.technicalBreakdown });
        }
      } catch (error) {
        console.error("Failed to fetch clinical insight", error);
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchClinicalInsight();

  }, [answers, student]);

  const radarData = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.subjectScores).map(([subject, data]) => {
      const subjectData = data as { rawScore: number, level: string, status: string };
      return {
        subject: subject.substring(0, 4), // abbreviate for chart
        score: Math.round(subjectData.rawScore),

      };
    });
  }, [report]);

  const { subjectScores, overallProfileName, avgOverall } = report;


  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full"></div>
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Evaluating Science Readiness...</h2>
        <p className="text-slate-500 max-w-md">
          Analyzing your foundational responses, identifying concept gaps across core subjects, and calibrating your personalized Science Readiness Blueprint.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        id="report-content" className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden print:shadow-none print:border-none"
      >
        <div className="bg-[#0F172A] text-white p-8 md:p-12 print:bg-white print:text-[#0F172A]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">SCIENCE READINESS BLUEPRINT</h1>
              <p className="text-[#94A3B8] print:text-[#64748B]">Science Transition Academy • Foundation Analysis & Learning Roadmap</p>
            </div>
            <div className="flex items-center gap-3 hidden md:flex print:hidden">
              {onNavigateHome && (
                <button 
                  onClick={onNavigateHome}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Academy Home</span>
                </button>
              )}
              <button 
                onClick={() => handleDownloadPdf()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-[#60A5FA]" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 print:border-[#E2E8F0]">
            <div>
              <p className="text-[10px] text-[#94A3B8] print:text-[#64748B] font-bold uppercase tracking-wider mb-1">Student</p>
              <p className="font-semibold">{student.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] print:text-[#64748B] font-bold uppercase tracking-wider mb-1">Status</p>
              <p className="font-semibold text-sm">{student.employmentStatus}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] print:text-[#64748B] font-bold uppercase tracking-wider mb-1">Availability</p>
              <p className="font-semibold text-sm">{student.dailyStudyHours}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] print:text-[#64748B] font-bold uppercase tracking-wider mb-1">Learning Style</p>
              <p className="font-semibold text-sm">{student.learningMethod}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] print:bg-white">
            <div className="w-32 h-32 rounded-full border-[8px] border-white shadow-sm flex items-center justify-center shrink-0 bg-[#2563EB]">
              <span className="text-4xl font-black text-white">{Math.round(avgOverall)}%</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Foundational Baseline</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-3 tracking-tight">{overallProfileName}</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(subjectScores).map(([subject, data]) => {
                  const subjectData = data as { rawScore: number, level: string, status: string };
                  return (
                  <div key={subject} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E2E8F0]">
                    <span className="text-sm font-semibold text-slate-700">{subject}</span>
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      subjectData.level === 'Critical' ? 'bg-red-50 text-red-700' :
                      subjectData.level === 'Weak' ? 'bg-orange-50 text-orange-700' :
                      subjectData.level === 'Developing' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {subjectData.level}
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
            
          </div>

          {/* Competency Visualization & AI Analysis Section */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Radar Chart (Always Visible) */}
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-[#0F172A] w-full text-left mb-6">Subject Foundation Radar</h3>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Your Score" dataKey="score" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Your Score</div>
                </div>
              </div>

              {/* Primary Foundation Gap */}
              {aiAnalysis ? (
                <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-[#0F172A]">Primary Foundation Gap</h3>
                  </div>
                  <p className="text-[#334155] leading-relaxed text-sm md:text-base font-medium">
                    {aiAnalysis.hiddenBottleneck}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex flex-col justify-center items-center text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">Analyzing Foundation Gaps...</h3>
                  <p className="text-[#334155] text-sm font-medium">Evaluating your conceptual starting points.</p>
                </div>
              )}
            </div>

            {/* Learning Profile & Patterns */}
            <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-[#0F172A]">Learning Profile & Cognitive Patterns</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setInsightMode('highLevel')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${insightMode === 'highLevel' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    High-level Summary
                  </button>
                  <button 
                    onClick={() => setInsightMode('technical')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${insightMode === 'technical' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Technical Breakdown
                  </button>
                </div>
              </div>
              <div className="min-h-[100px] flex items-center justify-center">
                {isInsightLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Generating personalized learning profile insights...</p>
                  </div>
                ) : clinicalInsight ? (
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {insightMode === 'highLevel' ? clinicalInsight.highLevelSummary : clinicalInsight.technicalBreakdown}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Learning profile insight is not available.</p>
                )}
              </div>
            </div>

            {aiAnalysis && (
              <>
                {/* Learning Principles */}
                <div className="bg-[#0F172A] rounded-2xl p-8 border border-[#1E293B] text-white">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Personalized Study Principles</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">Recommended learning rules tailored for a <strong className="text-white">{student.learningMethod}</strong> learner:</p>
                  <ul className="space-y-5">
                    {Array.isArray(aiAnalysis.unfairAdvantage) ? aiAnalysis.unfairAdvantage.map((rule, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200 leading-relaxed">{rule}</span>
                      </li>
                    )) : <li className="text-sm text-slate-200">Leverage your unique learning style in every study session.</li>}
                  </ul>
                </div>

                {/* Interactive Roadmap Widget */}
                <div className="bg-slate-50 rounded-2xl p-8 border border-[#E2E8F0] mt-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E2E8F0] pb-4">
                    <div className="flex items-center gap-3">
                      <ListTodo className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-[#0F172A]">Science Foundation Roadmap</h3>
                    </div>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button 
                        onClick={() => setRoadmapMode('4month')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${roadmapMode === '4month' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        4-Month View
                      </button>
                      <button 
                        onClick={() => setRoadmapMode('weekly')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${roadmapMode === 'weekly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Weekly Breakdown
                      </button>
                    </div>
                  </div>
                  
                  {roadmapMode === '4month' && aiAnalysis.fourMonthPrescription ? (
                    <div className="grid md:grid-cols-4 gap-6">
                      {Array.isArray(aiAnalysis.fourMonthPrescription) && aiAnalysis.fourMonthPrescription.map((monthPlan, idx) => (
                        <div key={idx} onClick={() => handleTaskClick(monthPlan)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">Month {idx + 1}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{monthPlan.replace(/^Month \d+: /, '')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <ul className="space-y-4">
                        {Array.isArray(aiAnalysis.sevenDayBlueprint) ? aiAnalysis.sevenDayBlueprint.map((dayPlan, idx) => (
                          <li key={idx} onClick={() => handleTaskClick(dayPlan)} className="flex gap-4 items-start cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed font-medium pt-1">{dayPlan}</span>
                          </li>
                        )) : <li className="text-sm text-slate-600">Focus on consistent daily review and active recall.</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Subject Breakdown Insights */}
          {subjectInsights && (
            <div className="border-t border-[#E2E8F0] pt-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-[#0F172A]" />
                <h3 className="text-2xl font-bold text-[#0F172A]">Subject Readiness Breakdown</h3>
              </div>
              
              {/* Radar Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">Performance Radar</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value}%`, 'Accuracy']}
                      />
                      <Radar name="Student" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(subjectInsights).map(([subject, data]) => {
                  const typedData = data as { strengths: string[], needsImprovement: string[] };
                  if (typedData.strengths.length === 0 && typedData.needsImprovement.length === 0) return null;
                  return (
                    <div 
                      key={subject} 
                      className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm cursor-pointer hover:border-indigo-300 hover:ring-2 hover:ring-indigo-50 transition-all group relative overflow-hidden"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                          View Drill-Down <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2 group-hover:text-indigo-700 transition-colors">{subject}</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Strengths
                          </p>
                          {typedData.strengths.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                              {typedData.strengths.map((topic, i) => (
                                <li key={i} className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">{topic}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500 italic">No significant strengths detected yet.</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Needs Improvement
                          </p>
                          {typedData.needsImprovement.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                              {typedData.needsImprovement.map((topic, i) => (
                                <li key={i} className="text-xs font-semibold bg-orange-50 text-orange-700 px-2 py-1 rounded-md border border-orange-100">{topic}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500 italic">No critical gaps detected.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Data-Driven Study Plan Section */}
          <div className="border-t border-[#E2E8F0] pt-8 print:hidden">
            <div className="flex flex-col items-center justify-center space-y-4">
              {!showStudyPlan ? (
                <button 
                  onClick={() => setShowStudyPlan(true)}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-base font-bold hover:bg-indigo-700 shadow-md transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5" />
                  View Prioritized Foundation Plan
                </button>
              ) : (
                <div className="w-full bg-white rounded-2xl p-8 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <ListTodo className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-[#0F172A]">Prioritized Foundation Topics</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Based on your readiness assessment, here are the foundational topics to rebuild first, ranked by concept gap.</p>
                  
                  <div className="space-y-4">
                    {studyPlanTopics.length > 0 ? studyPlanTopics.map((topic, idx) => (
                      <div key={topic.topic} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-red-100 text-red-700' : idx < 6 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{topic.topic}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{topic.subject}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${topic.percentage < 40 ? 'text-red-600' : topic.percentage < 70 ? 'text-orange-600' : 'text-blue-600'}`}>
                            {Math.round(topic.percentage)}%
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Proficiency</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm font-semibold text-green-600 bg-green-50 p-4 rounded-xl text-center border border-green-200">
                        You mastered all topics perfectly!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Question Review */}
          <div className="border-t border-[#E2E8F0] pt-8">
            <button 
              onClick={() => setShowDetailedReview(!showDetailedReview)}
              className="w-full flex items-center justify-between bg-[#F8FAFC] hover:bg-slate-100 transition-colors p-6 rounded-xl border border-[#E2E8F0]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[#0F172A]">Detailed Question Breakdown</h3>
                  <p className="text-xs text-[#64748B]">Review your exact answers and the correct reasoning.</p>
                </div>
              </div>
              {showDetailedReview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            <AnimatePresence>
              {showDetailedReview && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-6">
                    {answers.map((answer, index) => {
                      const question = QUESTIONS.find(q => q.id === answer.questionId);
                      if (!question) return null;
                      const selectedOption = question.options.find(o => o.id === answer.optionId);
                      const correctOption = question.options.reduce((prev, current) => (prev.points > current.points) ? prev : current);
                      const isCorrect = answer.points === 5;
                      const isPartial = answer.points > 0 && answer.points < 5;

                      return (
                        <div key={answer.questionId} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                          <div className="p-5 border-b border-[#E2E8F0] bg-gray-50/50">
                            <div className="flex justify-between gap-4 mb-2">
                              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                Question {index + 1} • {question.subject}
                              </span>
                              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                {question.topic}
                              </span>
                            </div>
                            <p className="font-medium text-[#0F172A] text-sm md:text-base leading-relaxed">{question.text}</p>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : isPartial ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                              <div className="flex gap-3 items-start">
                                {isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isPartial ? 'text-yellow-600' : 'text-red-600'}`} />
                                )}
                                <div>
                                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isCorrect ? 'text-green-800' : isPartial ? 'text-yellow-800' : 'text-red-800'}`}>Your Answer</p>
                                  <p className="text-sm font-medium text-gray-900">{selectedOption?.text}</p>
                                  <p className={`text-[10px] mt-2 font-bold ${isCorrect ? 'text-green-700' : isPartial ? 'text-yellow-700' : 'text-red-700'}`}>Score: {answer.points}/5</p>
                                </div>
                              </div>
                            </div>

                            {!isCorrect && (
                              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                                <div className="flex gap-3 items-start">
                                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-blue-800">Correct Answer</p>
                                    <p className="text-sm font-medium text-blue-900">{correctOption.text}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex gap-3 items-start">
                              <Info className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#64748B]">Why?</p>
                                <p className="text-sm text-[#475569] leading-relaxed">
                                  {question.explanation || `The correct answer is rooted in the core principles of ${question.topic}. Reviewing this concept is essential to building a solid scientific foundation.`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Founding Cohort Connection Section */}
          {(() => {
            const failedTopics = Array.from(new Set(
              answers
                .filter(a => a.points < 5)
                .map(a => QUESTIONS.find(q => q.id === a.questionId)?.topic)
                .filter(Boolean)
            ));
            const message = `Hello, I just completed the Science Readiness Assessment and would like to learn more about the Science Transition Academy Founding Cohort. (Candidate: ${student.name}, Foundational Baseline: ${Math.round(avgOverall)}%, Goal: ${student.courseGoal})`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappLink = `https://wa.me/${FOUNDING_COHORT_CONFIG.contactWhatsAppNumber}?text=${encodedMessage}`;

            return (
              <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden print:hidden border border-slate-800">
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Next Steps · Science Transition Academy</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Ready to Rebuild Your Science Foundation?
                  </h3>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                    The assessment shows you where you are starting. The Academy is designed to help you build from there. 
                    You've identified your foundational baseline ({Math.round(avgOverall)}%) and key concept gaps. The next step is deciding how you want to build toward <strong className="text-white">{student.courseGoal}</strong>.
                  </p>

                  {/* Cohort Snapshot Card */}
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-left space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-base">Science Transition Academy — Founding Cohort</h4>
                        <p className="text-xs text-blue-400">{statusInfo.badgeText} · {FOUNDING_COHORT_CONFIG.cohortCode}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto ${statusInfo.badgeColor}`}>
                        {statusInfo.badgeText}
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Direct foundational instruction in Mathematics, Physics, Chemistry, and Biology.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Guided practice clinics bridging formula memorization to intuitive problem solving.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Personalized academic direction aligned with your target degree or nursing goal.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCohortModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                    >
                      <span>{statusInfo.primaryButtonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Discuss Blueprint on WhatsApp</span>
                    </a>
                  </div>

                  <div className="pt-2 text-center">
                    {onNavigateHome && (
                      <button
                        onClick={onNavigateHome}
                        className="text-xs text-slate-400 hover:text-white transition-colors underline"
                      >
                        Explore the Academy Homepage &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="bg-[#F8FAFC] p-6 md:p-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider text-center md:text-left">
            Science Transition Academy • Foundation Assessment Platform
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onRestart}
              className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
            <button 
              onClick={() => handleDownloadPdf()}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-800 shadow-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save Blueprint
            </button>
          </div>
        </div>
      </motion.div>


      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-indigo-600 p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedSubject}</h3>
                    <p className="text-indigo-100 text-sm font-medium">Foundational Concept Drill-Down</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                <div className="mb-6">
                  <p className="text-sm text-slate-600">
                    Below is the concept breakdown of your performance in <strong>{selectedSubject}</strong>. We've isolated each foundational concept and flagged specific questions to help you target your review.
                  </p>
                </div>
                
                <div className="space-y-8">
                  {(() => {
                    // Group answers for this subject by topic
                    const subjectAnswers = answers.filter(a => {
                      const q = QUESTIONS.find(q => q.id === a.questionId);
                      return q && q.subject === selectedSubject;
                    });
                    
                    if (subjectAnswers.length === 0) {
                      return <p className="text-slate-500 italic text-center py-8">No data available for this subject.</p>;
                    }

                    const topicGroups: Record<string, { total: number, earned: number, answers: typeof answers }> = {};
                    subjectAnswers.forEach(ans => {
                      const q = QUESTIONS.find(q => q.id === ans.questionId);
                      if (!q) return;
                      if (!topicGroups[q.topic]) {
                        topicGroups[q.topic] = { total: 0, earned: 0, answers: [] };
                      }
                      topicGroups[q.topic].answers.push(ans);
                      const maxPts = Math.max(...q.options.map(o => o.points));
                      topicGroups[q.topic].total += maxPts;
                      topicGroups[q.topic].earned += ans.points;
                    });

                    // Sort topics by weakest first (lowest accuracy)
                    const sortedTopics = Object.entries(topicGroups).sort(([, a], [, b]) => (a.earned / a.total) - (b.earned / b.total));

                    return sortedTopics.map(([topic, stats]) => {
                      const accuracy = Math.round((stats.earned / stats.total) * 100);
                      const isWeak = accuracy < 100;
                      
                      return (
                        <div key={topic} className={`bg-white rounded-xl border ${isWeak ? 'border-orange-200 shadow-orange-100/50' : 'border-green-200 shadow-green-100/50'} shadow-sm overflow-hidden`}>
                          <div className={`px-6 py-4 border-b flex justify-between items-center ${isWeak ? 'bg-orange-50/50 border-orange-100' : 'bg-green-50/50 border-green-100'}`}>
                            <div className="flex items-center gap-3">
                              {isWeak ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                              <h4 className="text-lg font-bold text-slate-800">{topic}</h4>
                            </div>
                            <div className="text-right">
                              <span className={`text-2xl font-black ${isWeak ? 'text-orange-600' : 'text-green-600'}`}>{accuracy}%</span>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accuracy</p>
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            {stats.answers.map((ans, idx) => {
                              const q = QUESTIONS.find(q => q.id === ans.questionId);
                              if (!q) return null;
                              const maxPts = Math.max(...q.options.map(o => o.points));
                              const isCorrect = ans.points === maxPts;
                              const selectedOpt = q.options.find(o => o.id === ans.optionId);
                              
                              if (isCorrect) return null; // Only show missed questions in drill-down for brevity (or show all, but missed is better for drill-down)

                              return (
                                <div key={ans.questionId} className="bg-slate-50 rounded-lg p-5 border border-slate-200 relative">
                                  <div className="absolute top-0 right-0 px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-lg">
                                    Foundation Gap
                                  </div>
                                  <p className="font-bold text-slate-800 text-sm mb-4 pr-24">{q.text}</p>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3 bg-red-50/50 border border-red-100 p-3 rounded-md">
                                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1">Your Selection</p>
                                        <p className="text-sm text-red-900 font-medium">{selectedOpt?.text}</p>
                                      </div>
                                    </div>
                                    <div className="mt-4 border-l-2 border-indigo-200 pl-4">
                                      <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Foundational Explanation</p>
                                      <p className="text-sm text-slate-600 leading-relaxed">{q.explanation || `The correct answer is rooted in the core principles of ${q.topic}. Reviewing this concept is essential to building a solid scientific foundation.`}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {stats.answers.every(ans => {
                               const q = QUESTIONS.find(q => q.id === ans.questionId);
                               if(!q) return true;
                               const maxPts = Math.max(...q.options.map(o => o.points));
                               return ans.points === maxPts;
                            }) && (
                              <p className="text-sm text-slate-500 italic flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Flawless execution. You answered all questions in this concept correctly.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">Quick Review</h3>
              </div>
              <div className="mb-6 shrink-0">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Target Task</p>
                <p className="text-slate-800 font-medium">{selectedTask.replace(/^Month \d+: |^Day \d+: /, '')}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex-1 overflow-y-auto">
                {isReviewLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                    <p className="text-sm font-medium text-slate-500">Synthesizing review material...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">
                    {quickReviewContent}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Founding Cohort In-Report Application Modal */}
      <CohortApplicationModal
        isOpen={cohortModalOpen}
        onClose={() => setCohortModalOpen(false)}
        student={student}
        assessmentScore={avgOverall}
        onNavigateHome={onNavigateHome}
      />
    </div>
  );
}

