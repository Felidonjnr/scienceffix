const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// 1. Add state for selectedSubject
const stateTarget = `  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [quickReviewContent, setQuickReviewContent] = useState<string | null>(null);`;
const stateReplacement = `  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [quickReviewContent, setQuickReviewContent] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);`;
code = code.replace(stateTarget, stateReplacement);


// 2. Make the subject cards clickable
const cardTarget = `                    <div key={subject} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2">{subject}</h4>`;
const cardReplacement = `                    <div 
                      key={subject} 
                      className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm cursor-pointer hover:border-indigo-300 hover:ring-2 hover:ring-indigo-50 transition-all group relative overflow-hidden"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                          View Drill-Down <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2 group-hover:text-indigo-700 transition-colors">{subject}</h4>`;
code = code.replace(cardTarget, cardReplacement);

// Need to import ChevronRight if not there. Let's just add it dynamically at the end if it fails.
if (!code.includes('ChevronRight')) {
  code = code.replace(
    "import { BookOpen, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2, Info, BrainCircuit, Activity, HeartPulse, Zap, XCircle, Sparkles, Target, Clock, ArrowRight, Download, RotateCcw } from 'lucide-react';",
    "import { BookOpen, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2, Info, BrainCircuit, Activity, HeartPulse, Zap, XCircle, Sparkles, Target, Clock, ArrowRight, Download, RotateCcw, ChevronRight, Search } from 'lucide-react';"
  );
}

// 3. Add the Modal UI
const modalUI = `
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
                    Below is the clinical breakdown of your exact performance within <strong>{selectedSubject}</strong>. We've isolated the foundational concepts and flagged the specific questions where your knowledge broke down.
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
                        <div key={topic} className={\`bg-white rounded-xl border \${isWeak ? 'border-orange-200 shadow-orange-100/50' : 'border-green-200 shadow-green-100/50'} shadow-sm overflow-hidden\`}>
                          <div className={\`px-6 py-4 border-b flex justify-between items-center \${isWeak ? 'bg-orange-50/50 border-orange-100' : 'bg-green-50/50 border-green-100'}\`}>
                            <div className="flex items-center gap-3">
                              {isWeak ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                              <h4 className="text-lg font-bold text-slate-800">{topic}</h4>
                            </div>
                            <div className="text-right">
                              <span className={\`text-2xl font-black \${isWeak ? 'text-orange-600' : 'text-green-600'}\`}>{accuracy}%</span>
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
                                    Missed Concept
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
                                      <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Clinical Explanation</p>
                                      <p className="text-sm text-slate-600 leading-relaxed">{q.explanation || \`The correct answer is rooted in the core principles of \${q.topic}. Reviewing this concept is essential to building a solid scientific foundation.\`}</p>
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
`;

const insertTarget = `      <AnimatePresence>
        {selectedTask && (`;
code = code.replace(insertTarget, modalUI + insertTarget);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Drill-down modal added successfully.");
