const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  "const [insightMode, setInsightMode] = useState<'highLevel' | 'technical'>('highLevel');",
  "const [insightMode, setInsightMode] = useState<'highLevel' | 'technical'>('highLevel');\n  const [roadmapMode, setRoadmapMode] = useState<'weekly' | '4month'>('4month');"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Updated state");
