const fs = require('fs');

let reportView = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

reportView = reportView.replace(
  'const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);',
  'const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);\n  const [clinicalInsight, setClinicalInsight] = useState<string | null>(null);\n  const [isInsightLoading, setIsInsightLoading] = useState(true);'
);

const fetchInsightCode = `
    const fetchClinicalInsight = async () => {
      try {
        const response = await fetch('/api/clinical-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        if (response.ok) {
          const data = await response.json();
          setClinicalInsight(data.clinicalInsight);
        }
      } catch (error) {
        console.error("Failed to fetch clinical insight", error);
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchClinicalInsight();
`;

reportView = reportView.replace(
  'fetchAnalysis();',
  'fetchAnalysis();\n' + fetchInsightCode
);

const insightUi = `
          {/* Clinical Insight */}
          <div className="border-t border-[#E2E8F0] pt-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-[#0F172A]">Clinical Insight</h3>
            </div>
            {isInsightLoading ? (
              <div className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p className="text-indigo-600 font-bold">Generating Doctor-Like Summary...</p>
              </div>
            ) : clinicalInsight ? (
              <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                  {clinicalInsight}
                </p>
              </div>
            ) : null}
          </div>
`;

reportView = reportView.replace(
  '{/* Cognitive Pathology */}',
  insightUi + '\n          {/* Cognitive Pathology */}'
);

fs.writeFileSync('src/components/ReportView.tsx', reportView);
console.log('Done');
