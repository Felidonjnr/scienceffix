const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  '"sevenDayBlueprint": ["Day 1: Clinical Intervention...", "Day 2: Structural rebuild...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."]',
  '"sevenDayBlueprint": ["Day 1: Clinical Intervention...", "Day 2: Structural rebuild...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."],\n          "fourMonthPrescription": ["Month 1: Phase 1...", "Month 2: Phase 2...", "Month 3: Phase 3...", "Month 4: Phase 4..."]'
);

fs.writeFileSync('server.ts', code);
