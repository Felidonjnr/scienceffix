const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/quick-review", async (req, res) => {
    try {
      const { task } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = \`
        You are an elite tutor. A student has this specific study task: "\${task}".
        Provide a very brief, high-yield 'Quick Review' (about 2-3 short paragraphs or bullet points) that gives them the core concepts, a mnemonic, or a key mental model to immediately start learning this.
        
        Provide your response as a valid JSON object with a single field "reviewContent" containing the plain text or basic markdown text. Do not use markdown blocks like \\\`\\\`\\\`json.
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
      console.error("Quick Review Error:", error);
      res.status(500).json({ error: "Failed to generate quick review" });
    }
  });

  // Vite middleware for development
`;

code = code.replace('  // Vite middleware for development', newRoute);
fs.writeFileSync('server.ts', code);
console.log("Updated server.ts");
