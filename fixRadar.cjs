const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const target = `  const subjectInsights = useMemo(() => {`;
const replacement = `  const radarData = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.subjectScores).map(([subject, data]) => ({
      subject,
      score: Math.round((data.score / (data.totalQuestions * 5)) * 100) || 0,
      fullMark: 100
    }));
  }, [report]);

  const subjectInsights = useMemo(() => {`;

if (code.includes(target) && !code.includes('const radarData =')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Fixed radarData");
} else {
  console.log("Already fixed or target not found");
}
