const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const useMemoInjection = `
  const pathologyData = useMemo(() => {
    if (!report?.cognitivePathology) return [];
    return Object.entries(report.cognitivePathology).map(([skill, data]) => ({
      skill,
      score: data.score
    })).sort((a, b) => b.score - a.score);
  }, [report]);
  
  const behavioral = report?.behavioralMetrics;
`;

code = code.replace(/const handleDownloadPdf = \(\) => {/, useMemoInjection + '\n  const handleDownloadPdf = () => {');

const behaviorUi = `
          {/* Behavioral Autopsy */}
          {behavioral && (
            <div className="border-t border-[#E2E8F0] pt-8">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-[#0F172A]">Behavioral Autopsy</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                  <p className="text-3xl font-black text-red-600 mb-1">{behavioral.arrogantErrors}</p>
                  <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Arrogant Errors</p>
                  <p className="text-[10px] text-red-600 mt-1">High confidence, wrong answer</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                  <p className="text-3xl font-black text-yellow-600 mb-1">{behavioral.fastGuesses}</p>
                  <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Panic Guesses</p>
                  <p className="text-[10px] text-yellow-600 mt-1">Answered in < 15s, wrong</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                  <p className="text-3xl font-black text-orange-600 mb-1">{behavioral.slowInefficiencies}</p>
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">Time Bleeds</p>
                  <p className="text-[10px] text-orange-600 mt-1">Took > 90s, but correct</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <p className="text-3xl font-black text-blue-600 mb-1">{Math.round(behavioral.averageTime)}s</p>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Avg Time / Q</p>
                  <p className="text-[10px] text-blue-600 mt-1">Overall pace</p>
                </div>
              </div>
            </div>
          )}

          {/* Cognitive Pathology */}
          {pathologyData.length > 0 && (
            <div className="border-t border-[#E2E8F0] pt-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl font-bold text-[#0F172A]">Cognitive Pathology Scan</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">Your performance mapped by underlying cognitive skills, revealing exactly how your brain processes complex information.</p>
                  {pathologyData.map(p => (
                    <div key={p.skill} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-700">{p.skill}</span>
                        <span className="text-sm font-bold text-blue-600">{Math.round(p.score)}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={\`h-full \${p.score < 40 ? 'bg-red-500' : p.score < 70 ? 'bg-yellow-500' : 'bg-green-500'}\`} 
                          style={{ width: \`\${p.score}%\` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0F172A] rounded-2xl p-6 text-white flex flex-col justify-center">
                  <h4 className="text-lg font-bold mb-2">The Diagnosis</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    The engine detected severe structural weaknesses in <strong>{pathologyData[pathologyData.length - 1]?.skill}</strong> and <strong>{pathologyData[pathologyData.length - 2]?.skill}</strong>. This means when questions required these skills, your cognitive framework collapsed, leading to rapid guessing or critical failures.
                  </p>
                </div>
              </div>
            </div>
          )}
`;

code = code.replace(/\{\/\* AI Analysis Section \*\/\}/, behaviorUi + '\n          {/* AI Analysis Section */}');

fs.writeFileSync('src/components/ReportView.tsx', code);
