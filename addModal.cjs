const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const modalJSX = `
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">Quick Review</h3>
              </div>
              <div className="mb-6 shrink-0">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Target Task</p>
                <p className="text-slate-800 font-medium">{selectedTask.replace(/^Month \\d+: |^Day \\d+: /, '')}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex-1 overflow-y-auto">
                {isReviewLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                    <p className="text-sm font-medium text-slate-500">Synthesizing review material...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">
                    {quickReviewContent}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n}/g, modalJSX);

fs.writeFileSync('src/components/ReportView.tsx', code);
