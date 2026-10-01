const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Add Recharts import
if (!code.includes('RadarChart')) {
  code = code.replace(
    "import { motion, AnimatePresence } from 'motion/react';",
    "import { motion, AnimatePresence } from 'motion/react';\nimport { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';"
  );
}

// Compute Radar Data
const dataComputeTarget = `  const overallScore = answers.reduce((acc, curr) => acc + curr.points, 0);`;
const dataComputeReplacement = `  const overallScore = answers.reduce((acc, curr) => acc + curr.points, 0);

  const radarData = useMemo(() => {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    return subjects.map(sub => {
      const subAnswers = answers.filter(a => {
        const q = QUESTIONS.find(q => q.id === a.questionId);
        return q?.subject === sub;
      });
      if (subAnswers.length === 0) return { subject: sub, score: 0, fullMark: 100 };
      const subScore = subAnswers.reduce((acc, curr) => acc + curr.points, 0);
      const subTotal = subAnswers.length * 5;
      return {
        subject: sub,
        score: Math.round((subScore / subTotal) * 100),
        fullMark: 100
      };
    });
  }, [answers]);`;

if (code.includes(dataComputeTarget)) {
  code = code.replace(dataComputeTarget, dataComputeReplacement);
} else {
  console.log("Failed to inject radarData compute");
}

const uiTarget = `          {/* Subject Breakdown Insights */}
          {subjectInsights && (
            <div className="border-t border-[#E2E8F0] pt-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-[#0F172A]" />
                <h3 className="text-2xl font-bold text-[#0F172A]">Subject Breakdown Insights</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">`;

const uiReplacement = `          {/* Subject Breakdown Insights */}
          {subjectInsights && (
            <div className="border-t border-[#E2E8F0] pt-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-[#0F172A]" />
                <h3 className="text-2xl font-bold text-[#0F172A]">Subject Breakdown Insights</h3>
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
                        formatter={(value) => [\`\${value}%\`, 'Accuracy']}
                      />
                      <Radar name="Student" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">`;

if (code.includes(uiTarget)) {
  code = code.replace(uiTarget, uiReplacement);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Success");
} else {
  console.log("UI Target not found!");
}
