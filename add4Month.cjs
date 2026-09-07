const fs = require('fs');

let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const fourMonthUi = `
              {/* 4-Month Prescription */}
              {aiAnalysis.fourMonthPrescription && (
                <div className="bg-slate-50 rounded-2xl p-8 border border-[#E2E8F0] mt-8">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <ListTodo className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-[#0F172A]">4-Month Targeted Prescription</h3>
                  </div>
                  <div className="grid md:grid-cols-4 gap-6">
                    {Array.isArray(aiAnalysis.fourMonthPrescription) && aiAnalysis.fourMonthPrescription.map((monthPlan, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">Month {idx + 1}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{monthPlan.replace(/^Month \\d+: /, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

code = code.replace(
  '                </div>\n              </div>\n            )}',
  '                </div>\n              </div>\n' + fourMonthUi + '            )}'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
