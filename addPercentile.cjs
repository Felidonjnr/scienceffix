const fs = require('fs');

let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const hookInjection = `  const { subjectScores, overallProfileName, avgOverall } = report;

  const percentileData = useMemo(() => {
    let base = 50;
    const course = student.courseGoal.toLowerCase();
    if (course.includes('med') || course.includes('surg') || course.includes('law')) base = 70;
    else if (course.includes('eng') || course.includes('tech') || course.includes('comp') || course.includes('nurs') || course.includes('pharm')) base = 65;
    else if (course.includes('art') || course.includes('edu')) base = 55;
    
    let p = 50 + ((avgOverall - base) * 1.5);
    if (p > 99) p = 99;
    if (p < 1) p = 1;
    p = Math.round(p);
    
    let message = "";
    let color = "";
    let textColor = "";
    
    if (p >= 90) {
      message = "Top 10% - Highly Competitive";
      color = "bg-green-50 border-green-200";
      textColor = "text-green-700";
    } else if (p >= 75) {
      message = "Strong Candidate - On Track";
      color = "bg-emerald-50 border-emerald-200";
      textColor = "text-emerald-700";
    } else if (p >= 50) {
      message = "Average - Needs Polish";
      color = "bg-yellow-50 border-yellow-200";
      textColor = "text-yellow-700";
    } else {
      message = "Below Average - High Risk";
      color = "bg-red-50 border-red-200";
      textColor = "text-red-700";
    }
    
    return { p, message, color, textColor };
  }, [student.courseGoal, avgOverall]);
`;

code = code.replace(
  '  const { subjectScores, overallProfileName, avgOverall } = report;',
  hookInjection
);

const uiReplaceStart = `          {/* Core Score Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] print:bg-white">`;

const uiReplaceEnd = `          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col md:flex-row gap-8 items-center bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] print:bg-white">`;

code = code.replace(uiReplaceStart, uiReplaceEnd);

const uiAfterCoreScore = `            </div>
          </div>

          {/* Competency Visualization & AI Analysis Section */}`;

const newUiAfterCoreScore = `            </div>
            
            {/* Percentile Ranking Card */}
            <div className={\`rounded-2xl p-8 border flex flex-col items-center justify-center text-center \${percentileData.color}\`}>
              <TrendingUp className={\`w-8 h-8 mb-4 \${percentileData.textColor}\`} />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Historical Percentile</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={\`text-5xl font-black \${percentileData.textColor}\`}>{percentileData.p}</span>
                <span className={\`text-xl font-bold \${percentileData.textColor}\`}>th</span>
              </div>
              <p className={\`text-sm font-bold mb-4 \${percentileData.textColor}\`}>{percentileData.message}</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on historical data for students targeting <strong className="text-slate-800">{student.courseGoal}</strong>.
              </p>
            </div>
          </div>

          {/* Competency Visualization & AI Analysis Section */}`;

code = code.replace(uiAfterCoreScore, newUiAfterCoreScore);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Done');
