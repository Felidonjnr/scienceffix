const fs = require('fs');

let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const clinicalInsightUi = `
            {/* Clinical Insight */}
            <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-[#0F172A]">Clinical Insight</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setInsightMode('highLevel')}
                    className={\`px-4 py-1.5 text-sm font-bold rounded-md transition-colors \${insightMode === 'highLevel' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}\`}
                  >
                    High-level Summary
                  </button>
                  <button 
                    onClick={() => setInsightMode('technical')}
                    className={\`px-4 py-1.5 text-sm font-bold rounded-md transition-colors \${insightMode === 'technical' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}\`}
                  >
                    Technical Breakdown
                  </button>
                </div>
              </div>
              <div className="min-h-[100px] flex items-center justify-center">
                {isInsightLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Generating personalized clinical insights...</p>
                  </div>
                ) : clinicalInsight ? (
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {insightMode === 'highLevel' ? clinicalInsight.highLevelSummary : clinicalInsight.technicalBreakdown}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Clinical insight is not available.</p>
                )}
              </div>
            </div>
`;

const target = '            </div>\n\n            {aiAnalysis && (';
const replacement = '            </div>\n' + clinicalInsightUi + '\n            {aiAnalysis && (';

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log(code.includes('Clinical Insight'));
