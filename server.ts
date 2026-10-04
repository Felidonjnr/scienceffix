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
        You are the Academic Director and Foundational Learning Specialist at Science Transition Academy.
        The Academy specializes in helping students and career transitioners (such as adults moving from arts/commercial backgrounds or returning to study for nursing, health, and tech careers) rebuild their science foundations.

        Analyze the following candidate profile and science readiness assessment results to generate a serious, credible, and supportive Readiness Blueprint.
        
        Candidate Profile:
        ${JSON.stringify(student, null, 2)}
        
        Raw Score & Performance Data:
        ${JSON.stringify(report, null, 2)}
        
        Your tone must be authoritative, academic, structured, and constructive. Diagnose where their conceptual foundation is incomplete or fragmented, and explain clearly what needs to be rebuilt to achieve their goal (${student.courseGoal || 'their target science program'}).

        DIRECTIVE: Analyze their 'behavioralMetrics' (time spent, overconfident errors where they were highly confident but incorrect, fast impulse guesses) and their 'cognitivePathology' scores. Use these exact metrics to identify key learning habits (e.g., formula dependency over concept mastery, impulse guessing, or calculation anxiety) and provide clear, actionable guidance.

        You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json.
        The JSON must follow this exact structure:
        {
          "hiddenBottleneck": "A thorough, authoritative academic diagnostic paragraph explaining the primary conceptual gaps and study habits limiting their performance. Reference specific behavioral metrics (e.g., fast guesses or high-confidence mistakes) to provide clear insight.",
          "unfairAdvantage": ["Core Study Principle 1", "Core Study Principle 2", "Core Study Principle 3"],
          "sevenDayBlueprint": ["Day 1: Foundational Review...", "Day 2: Concept Rebuild...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."],
          "fourMonthPrescription": ["Month 1: Foundation Phase...", "Month 2: Core Concepts Phase...", "Month 3: Advanced Application Phase...", "Month 4: Mastery & Readiness Phase..."]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.0
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

  
  app.post("/api/learning-insight", async (req, res) => {
    try {
      const { answers } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are an Academic Learning Specialist at Science Transition Academy.
        Analyze the following student assessment answers. Each answer includes the time spent and the student's reported confidence level.
        
        Answers Data:
        ${JSON.stringify(answers, null, 2)}
        
        Write a personalized academic assessment of their learning profile, focusing on pacing, confidence calibration, and foundational study patterns.
        Provide your response as a valid JSON object with TWO fields:
        - "highLevelSummary": A clear, structured summary for an adult student.
        - "technicalBreakdown": A detailed academic breakdown using cognitive and educational science terminology.
        Do not use markdown blocks like \`\`\`json.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.0
        }
      });
      
      const rawText = response.text || "{}";
      const analysis = JSON.parse(rawText);
      res.json(analysis);
    } catch (error) {
      console.error("Learning Insight Error:", error);
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
        You are a foundational science tutor at Science Transition Academy. A student has this specific study task: "${task}".
        Provide a concise, high-yield 'Quick Review' (2-3 short paragraphs or clear bullet points) that explains the core concepts, a helpful mnemonic, or key mental models needed to master this topic.
        
        Provide your response as a valid JSON object with a single field "reviewContent" containing the plain text or basic markdown text. Do not use markdown blocks like \`\`\`json.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.0
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
