const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Add Gemini import
server = server.replace(
  'import dotenv from "dotenv";',
  'import dotenv from "dotenv";\nimport { GoogleGenAI } from "@google/genai";'
);

// Add endpoint
const newEndpoint = `
  app.post("/api/clinical-insight", async (req, res) => {
    try {
      const { answers } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = \`
        You are an elite, clinical academic diagnostician.
        Analyze the following student answers. Each answer includes the time spent and the student's reported confidence level.
        
        Answers Data:
        \${JSON.stringify(answers, null, 2)}
        
        Write a concise, personalized, 'doctor-like' summary of their learning profile, focusing on their pacing, confidence vs. correctness, and cognitive habits.
        Provide your response as a valid JSON object with a single field "clinicalInsight" containing your paragraph. Do not use markdown blocks like \\\`\\\`\\\`json.
      \`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      
      const rawText = response.text || "{}";
      const analysis = JSON.parse(rawText);
      res.json(analysis);
    } catch (error) {
      console.error("Clinical Insight Error:", error);
      res.status(500).json({ error: "Failed to generate clinical insight" });
    }
  });

`;

server = server.replace(
  '// Vite middleware for development',
  newEndpoint + '  // Vite middleware for development'
);

fs.writeFileSync('server.ts', server);
console.log('Done');
