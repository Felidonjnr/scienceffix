const fs = require('fs');

let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  '              )}\\n            )}\\n          </div>',
  '              )}\\n              </>\\n            )}\\n          </div>'
);
// let's just do a substring search and replace
const target = `              )}
            )}
          </div>`;
const replacement = `              )}
              </>
            )}
          </div>`;
code = code.replace(target, replacement);

fs.writeFileSync('src/components/ReportView.tsx', code);
