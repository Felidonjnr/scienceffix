import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Define API routes FIRST
  app.post("/api/analyze", async (req, res) => {
    try {
      const { student, answers, report } = req.body;
      
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "DEEPSEEK_API_KEY is not configured on the server." });
      }

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey
      });

      const prompt = `
        You are an elite academic consultant and strategist charging premium rates for your insights.
        Analyze the following student profile and quiz performance to generate a "100,000 Naira Executive Blueprint".
        
        Student Profile:
        ${JSON.stringify(student, null, 2)}
        
        Raw Score Data:
        ${JSON.stringify(report, null, 2)}
        
        Write your response with intense rigor, making them feel like they just received a highly premium, insider document. 
        Be extremely direct, deeply analytical about why they failed, and provide an actionable 7-day roadmap based exactly on the time they said they had available.
        Act like a mentor setting them up for their final strategy session. Do NOT mention money or sell programs.

        You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json.
        The JSON must follow this exact structure:
        {
          "hiddenBottleneck": "The 'Aha!' moment diagnosis string. Don't just tell them what they failed, tell them WHY.",
          "unfairAdvantage": ["rule 1", "rule 2", "rule 3"],
          "sevenDayBlueprint": ["Day 1: ...", "Day 2: ...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      if (!response.choices[0].message.content) {
        throw new Error("No response generated");
      }
      
      let rawText = response.choices[0].message.content.trim();
      if (rawText.startsWith("\`\`\`")) {
        rawText = rawText.replace(/^\`\`\`(?:json)?\n?/, "").replace(/\n?\`\`\`$/, "");
      }
      const analysis = JSON.parse(rawText);

      res.json(analysis);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to generate AI analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
