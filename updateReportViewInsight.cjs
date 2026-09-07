const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Replace state
code = code.replace(
  'const [clinicalInsight, setClinicalInsight] = useState<string | null>(null);',
  'const [clinicalInsight, setClinicalInsight] = useState<{highLevelSummary: string, technicalBreakdown: string} | null>(null);\n  const [insightMode, setInsightMode] = useState<\'highLevel\' | \'technical\'>(\'highLevel\');'
);

// Replace setClinicalInsight call
code = code.replace(
  'setClinicalInsight(data.clinicalInsight);',
  'setClinicalInsight({ highLevelSummary: data.highLevelSummary, technicalBreakdown: data.technicalBreakdown });'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log(code.includes('insightMode'));
