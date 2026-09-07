const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  '<li key={idx} className="flex gap-4 items-start">',
  '<li key={idx} onClick={() => handleTaskClick(dayPlan)} className="flex gap-4 items-start cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
