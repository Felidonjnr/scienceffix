import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

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
        You are the 'Chief Architect', an elite, clinical, and ruthlessly precise academic doctor running a million-dollar diagnostic engine. You do not offer vague advice; you perform surgical autopsies on a student's cognitive framework.
        
        Analyze the following student profile and quiz performance to generate a terrifyingly accurate diagnostic report.
        
        Student Profile:
        ${JSON.stringify(student, null, 2)}
        
        Raw Score Data:
        ${JSON.stringify(report, null, 2)}
        
        Your tone must be authoritative, piercing, and highly clinical. Use medical/architectural terminology (e.g., "cognitive pathology," "structural collapse," "hemorrhaging points"). Make the student feel completely exposed, showing them exactly where their foundation is cracking and why their current approach is fatal to their goals. Do NOT sugarcoat.

        CRITICAL DIRECTIVE: You MUST analyze their 'behavioralMetrics' (time spent, arrogant errors where they were highly confident but wrong, fast impulse guesses) and their 'cognitivePathology' scores. Use these exact metrics to diagnose them. Tell them their exact "disease" (e.g., 'Dunning-Kruger Effect', 'Graph Illiteracy', 'Impulse Guessing').

        You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json.
        The JSON must follow this exact structure:
        {
          "hiddenBottleneck": "A ruthless, clinical paragraph diagnosing the exact cognitive pathology and behavioral flaws causing their failure. Use the behavioralMetrics (e.g. arrogantErrors, fastGuesses) to brutally expose their bad test-taking habits.",
          "unfairAdvantage": ["Prescriptive Rule 1", "Prescriptive Rule 2", "Prescriptive Rule 3"],
          "sevenDayBlueprint": ["Day 1: Clinical Intervention...", "Day 2: Structural rebuild...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."],
          "fourMonthPrescription": ["Month 1: Phase 1...", "Month 2: Phase 2...", "Month 3: Phase 3...", "Month 4: Phase 4..."]
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

  
  app.post("/api/clinical-insight", async (req, res) => {
    try {
      const { answers } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are an elite, clinical academic diagnostician.
        Analyze the following student answers. Each answer includes the time spent and the student's reported confidence level.
        
        Answers Data:
        ${JSON.stringify(answers, null, 2)}
        
        Write a personalized, 'doctor-like' summary of their learning profile, focusing on their pacing, confidence vs. correctness, and cognitive habits.
        Provide your response as a valid JSON object with TWO fields:
        - "highLevelSummary": A concise, easy-to-understand summary for a general audience.
        - "technicalBreakdown": A detailed, highly technical diagnostic breakdown using cognitive science terminology.
        Do not use markdown blocks like \`\`\`json.
      `;

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


  app.post("/api/quick-review", async (req, res) => {
    try {
      const { task } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are an elite tutor. A student has this specific study task: "${task}".
        Provide a very brief, high-yield 'Quick Review' (about 2-3 short paragraphs or bullet points) that gives them the core concepts, a mnemonic, or a key mental model to immediately start learning this.
        
        Provide your response as a valid JSON object with a single field "reviewContent" containing the plain text or basic markdown text. Do not use markdown blocks like \`\`\`json.
      `;

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
