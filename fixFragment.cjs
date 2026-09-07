const fs = require('fs');

let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /\{aiAnalysis && \(\s*<div className="grid md:grid-cols-2 gap-8">/,
  '{aiAnalysis && (\n              <>\n                <div className="grid md:grid-cols-2 gap-8">'
);

code = code.replace(
  / \}\)\}\s*\}\)\}\s*<\/div>/,
  '              )}\\n              </>\\n            )}\\n          </div>'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log(code.includes('<>'));
