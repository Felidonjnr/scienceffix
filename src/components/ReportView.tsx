import { useEffect, useState, useMemo } from 'react';
import { StudentData, Answer } from '../types';
import { computeReport } from '../utils/engine';
import { FileText, Download, RotateCcw, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Loader2, Sparkles, UserCheck, Clock, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { QUESTIONS } from '../data/questions';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface AIAnalysis {
  hiddenBottleneck: string;
  unfairAdvantage: string[];
  sevenDayBlueprint: string[];
}

export default function ReportView({ student, answers, onRestart }: { student: StudentData, answers: Answer[], onRestart: () => void }) {
  const [report, setReport] = useState<ReturnType<typeof computeReport> | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const handleDownloadPdf = () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    const opt = {
      margin:       0.2,
      filename:     `${student.name.replace(/\s+/g, "_")}_Academic_Blueprint.pdf`,
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
  }, [answers, student]);

  const radarData = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.subjectScores).map(([subject, data]) => {
      const subjectData = data as { rawScore: number, level: string, status: string };
      return {
        subject: subject.substring(0, 4), // abbreviate for chart
        score: Math.round(subjectData.rawScore),
        benchmark: 85, // Premium target
      };
    });
  }, [report]);

  if (!report) return null;

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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Diagnostic Data...</h2>
        <p className="text-slate-500 max-w-md">
          Our AI engine is processing your answers, identifying cognitive patterns, and building your personalized academic profile based on your lifestyle inputs.
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
              <h1 className="text-3xl font-bold tracking-tight mb-2">AI READINESS REPORT</h1>
              <p className="text-[#94A3B8] print:text-[#64748B]">Personalized Diagnostic & Strategy Analysis</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg hidden md:block print:hidden">
              <Sparkles className="w-8 h-8 text-[#60A5FA]" />
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
          
          {/* Core Score Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] print:bg-white">
            <div className="w-32 h-32 rounded-full border-[8px] border-white shadow-sm flex items-center justify-center shrink-0 bg-[#2563EB]">
              <span className="text-4xl font-black text-white">{Math.round(avgOverall)}%</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Diagnostic Baseline</p>
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

          {/* AI Analysis Section */}
          {aiAnalysis && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-[#0F172A] w-full text-left mb-6">Competency Radar</h3>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Your Score" dataKey="score" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.5} />
                        <Radar name="Target Benchmark" dataKey="benchmark" stroke="#10B981" fill="#34D399" fillOpacity={0.2} strokeDasharray="3 3" />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Your Score</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Target (85%)</div>
                  </div>
                </div>

                {/* Hidden Bottleneck */}
                <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-[#0F172A]">The Hidden Bottleneck</h3>
                  </div>
                  <p className="text-[#334155] leading-relaxed text-sm md:text-base font-medium">
                    {aiAnalysis.hiddenBottleneck}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 7-Day Blueprint */}
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <Clock className="w-6 h-6 text-slate-800" />
                    <h3 className="text-xl font-bold text-[#0F172A]">7-Day Micro-Blueprint</h3>
                  </div>
                  <ul className="space-y-4">
                    {Array.isArray(aiAnalysis.sevenDayBlueprint) ? aiAnalysis.sevenDayBlueprint.map((dayPlan, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-[#334155] leading-relaxed">{dayPlan}</span>
                      </li>
                    )) : <li className="text-sm text-[#334155]">Focus on consistent daily review and active recall.</li>}
                  </ul>
                </div>

                {/* Unfair Advantage */}
                <div className="bg-[#0F172A] rounded-2xl p-8 border border-[#1E293B] text-white">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Your "Unfair Advantage"</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">Strict rules tailored for a <strong className="text-white">{student.learningMethod}</strong> learner:</p>
                  <ul className="space-y-5">
                    {Array.isArray(aiAnalysis.unfairAdvantage) ? aiAnalysis.unfairAdvantage.map((rule, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200 leading-relaxed">{rule}</span>
                      </li>
                    )) : <li className="text-sm text-slate-200">Leverage your unique learning style in every study session.</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

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

          {/* CTA Section */}
          {(() => {
            const failedTopics = Array.from(new Set(
              answers
                .filter(a => a.points < 5)
                .map(a => QUESTIONS.find(q => q.id === a.questionId)?.topic)
                .filter(Boolean)
            ));
            const message = `Hello Chief! My name is ${student.name}. I just took the Science Diagnostic and scored ${Math.round(avgOverall)}%. I am a ${student.learningMethod} learner. My weakest areas were: ${failedTopics.join(', ')}. I would like to book a personalized strategy session!`;
            const encodedMessage = encodeURIComponent(message);
            // NOTE: Update this phone number with the actual WhatsApp number
            const whatsappLink = `https://wa.me/2348024646351?text=${encodedMessage}`;

            return (
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden print:hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Want a Personalized Study Track?</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    The AI has diagnosed your current baseline and learning style. To get your step-by-step roadmap, book a direct strategy session with the Chief Planner.
                  </p>
                  
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-8 text-left inline-block w-full max-w-md mx-auto">
                    <p className="font-bold text-white mb-2 flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-400" /> 
                      Step 1: Save your report
                    </p>
                    <p className="text-sm text-slate-300 mb-6">Before reaching out, click the "Save Report" button at the very bottom of this page to download your PDF.</p>
                    
                    <p className="font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#25D366]" />
                      Step 2: Send via WhatsApp
                    </p>
                    <p className="text-sm text-slate-300">Click below to send your results to my WhatsApp. Make sure to attach your PDF report to the chat!</p>
                  </div>

                  <div>
                    <a 
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/30 w-full sm:w-auto"
                    >
                      Send to WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="bg-[#F8FAFC] p-6 md:p-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider text-center md:text-left">
            Powered by Gemini AI Engine
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
              Save Report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
