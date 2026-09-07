const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  '<div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">',
  '<div key={idx} onClick={() => handleTaskClick(monthPlan)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow">'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
