const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const target = `              <>
                <div className="grid md:grid-cols-2 gap-8">
                {/* 7-Day Blueprint */}
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <Clock className="w-6 h-6 text-slate-800" />
                    <h3 className="text-xl font-bold text-[#0F172A]">7-Day Micro-Blueprint</h3>
                  </div>
                  <ul className="space-y-4">
                    {Array.isArray(aiAnalysis.sevenDayBlueprint) ? aiAnalysis.sevenDayBlueprint.map((dayPlan, idx) => (
                      <li key={idx} onClick={() => handleTaskClick(dayPlan)} className="flex gap-4 items-start cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
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

              {/* 4-Month Prescription */}
              {aiAnalysis.fourMonthPrescription && (
                <div className="bg-slate-50 rounded-2xl p-8 border border-[#E2E8F0] mt-8">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <ListTodo className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-[#0F172A]">4-Month Targeted Prescription</h3>
                  </div>
                  <div className="grid md:grid-cols-4 gap-6">
                    {Array.isArray(aiAnalysis.fourMonthPrescription) && aiAnalysis.fourMonthPrescription.map((monthPlan, idx) => (
                      <div key={idx} onClick={() => handleTaskClick(monthPlan)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">Month {idx + 1}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{monthPlan.replace(/^Month \\d+: /, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </>`;

const replacement = `              <>
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

                {/* Interactive Roadmap Widget */}
                <div className="bg-slate-50 rounded-2xl p-8 border border-[#E2E8F0] mt-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E2E8F0] pb-4">
                    <div className="flex items-center gap-3">
                      <ListTodo className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-[#0F172A]">Targeted Prescription Roadmap</h3>
                    </div>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button 
                        onClick={() => setRoadmapMode('4month')}
                        className={\`px-4 py-1.5 text-sm font-bold rounded-md transition-colors \${roadmapMode === '4month' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}\`}
                      >
                        4-Month View
                      </button>
                      <button 
                        onClick={() => setRoadmapMode('weekly')}
                        className={\`px-4 py-1.5 text-sm font-bold rounded-md transition-colors \${roadmapMode === 'weekly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}\`}
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
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{monthPlan.replace(/^Month \\d+: /, '')}</p>
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
              </>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Success");
} else {
  console.log("Target not found!");
}
