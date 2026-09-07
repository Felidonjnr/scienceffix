const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const targetHeader = `            <div className="p-3 bg-white/10 rounded-lg hidden md:block print:hidden">
              <Sparkles className="w-8 h-8 text-[#60A5FA]" />
            </div>
          </div>`;

const newHeader = `            <div className="flex items-center gap-4 hidden md:flex print:hidden">
              <button 
                onClick={() => handleDownloadPdf()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <div className="p-3 bg-white/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-[#60A5FA]" />
              </div>
            </div>
          </div>`;

code = code.replace(targetHeader, newHeader);
fs.writeFileSync('src/components/ReportView.tsx', code);
