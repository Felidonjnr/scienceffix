const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  'const [showStudyPlan, setShowStudyPlan] = useState(false);',
  `const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [quickReviewContent, setQuickReviewContent] = useState<string | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);`
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log(code.includes('selectedTask'));
