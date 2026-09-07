const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = `        Write a concise, personalized, 'doctor-like' summary of their learning profile, focusing on their pacing, confidence vs. correctness, and cognitive habits.
        Provide your response as a valid JSON object with a single field "clinicalInsight" containing your paragraph. Do not use markdown blocks like \\\`\\\`\\\`json.`;

const newPrompt = `        Write a personalized, 'doctor-like' summary of their learning profile, focusing on their pacing, confidence vs. correctness, and cognitive habits.
        Provide your response as a valid JSON object with TWO fields:
        - "highLevelSummary": A concise, easy-to-understand summary for a general audience.
        - "technicalBreakdown": A detailed, highly technical diagnostic breakdown using cognitive science terminology.
        Do not use markdown blocks like \\\`\\\`\\\`json.`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
console.log(code.includes("highLevelSummary"));
