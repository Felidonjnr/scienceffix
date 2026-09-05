import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";
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
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          hiddenBottleneck: {
            type: Type.STRING,
            description: "The 'Aha!' moment diagnosis. Don't just tell them what they failed, tell them WHY. (e.g., 'You don't have a Physics problem, you have a mathematical translation problem...')"
          },
          unfairAdvantage: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 strict, powerful rules or strategies tailored exactly to their learning style."
          },
          sevenDayBlueprint: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A highly actionable 7-day schedule based on their available study hours. Make each string a day's plan (e.g., 'Day 1: 40 mins active recall on Biology...')."
          }
        },
        required: ["hiddenBottleneck", "unfairAdvantage", "sevenDayBlueprint"]
      };

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
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2
        }
      });

      if (!response.text) {
        throw new Error("No response generated");
      }

      let rawText = response.text.trim(); if (rawText.startsWith("```")) { rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, ""); } const analysis = JSON.parse(rawText);
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
