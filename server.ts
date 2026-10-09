import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { portalStore } from "./src/server/portalStore";
import tutorialRoutes from "./src/server/tutorialRoutes";
import { QUESTIONS } from "./src/data/questions";

dotenv.config();

async function startServer() {
  await portalStore.initializePersistence();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Define API routes FIRST
  app.get("/api/questions", async (_req, res) => {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceRoleKey) {
        try {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/science_restart_questions?select=id,subject,profile_level,knowledge_type,topic,text,options,explanation,is_math_heavy,text_length,cognitive_skills,difficulty&active=eq.true&order=id.asc`,
            {
              headers: {
                "apikey": serviceRoleKey,
                "Authorization": `Bearer ${serviceRoleKey}`
              }
            }
          );

          if (response.ok) {
            const questions = await response.json();
            if (Array.isArray(questions) && questions.length > 0) {
              return res.json({ questions });
            }
          } else {
            console.warn("Supabase question retrieval failed, serving bundled question bank.");
          }
        } catch (supabaseErr) {
          console.warn("Supabase network error, serving bundled question bank:", supabaseErr);
        }
      }

      // Always reliably serve the complete 400-question production curriculum bank
      return res.json({ questions: QUESTIONS });
    } catch (error) {
      console.error("Question retrieval error:", error);
      return res.json({ questions: QUESTIONS });
    }
  });

  function adminAuthorized(req: express.Request) {
    const configured = process.env.ADMIN_DASHBOARD_KEY;
    const supplied = req.headers['x-admin-key'];
    return Boolean(configured && typeof supplied === 'string' && supplied === configured);
  }

  const handleAdminLeads = async (req: express.Request, res: express.Response) => {
    if (!adminAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceRoleKey) return res.status(503).json({ error: "Supabase is not configured." });
      const response = await fetch(`${supabaseUrl}/rest/v1/science_restart_leads?select=*&order=created_at.desc`, {
        headers: { "apikey": serviceRoleKey, "Authorization": `Bearer ${serviceRoleKey}` }
      });
      if (!response.ok) return res.status(502).json({ error: "Unable to retrieve leads." });
      res.json({ leads: await response.json() });
    } catch (error) {
      console.error("Lead retrieval error:", error);
      res.status(500).json({ error: "Unable to retrieve leads." });
    }
  };

  app.get("/api/admin/leads", handleAdminLeads);
  app.get("/api/admin-leads", handleAdminLeads);

  const handleAdminExport = async (req: express.Request, res: express.Response) => {
    if (!adminAuthorized(req)) return res.status(401).send("Unauthorized");
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceRoleKey) return res.status(503).send("Supabase is not configured.");
      const response = await fetch(`${supabaseUrl}/rest/v1/science_restart_leads?select=*&order=created_at.desc`, {
        headers: { "apikey": serviceRoleKey, "Authorization": `Bearer ${serviceRoleKey}` }
      });
      if (!response.ok) return res.status(502).send("Unable to retrieve leads.");
      const leads = await response.json() as Record<string, unknown>[];
      const columns = ["created_at","name","phone","age_range","previous_background","desired_pathway","science_status","biggest_challenge","last_studied_science","employment_status","preferred_schedule","target_year","wants_founding_cohort","willingness_to_pay","source"];
      const escapeCsv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
      const csv = [columns.join(","), ...leads.map(lead => columns.map(column => escapeCsv(lead[column])).join(","))].join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="science-restart-leads.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Lead export error:", error);
      res.status(500).send("Unable to export leads.");
    }
  };

  app.get("/api/admin/export", handleAdminExport);
  app.get("/api/admin-export", handleAdminExport);

  app.post("/api/interest", async (req, res) => {
    try {
      const {
        name, phone, ageRange, previousBackground, desiredPathway, scienceStatus,
        biggestChallenge, lastStudiedScience, employmentStatus, preferredSchedule,
        targetYear, wantsFoundingCohort, willingnessToPay, source
      } = req.body || {};

      if (!name || !phone || !ageRange || !desiredPathway || !scienceStatus || !biggestChallenge) {
        return res.status(400).json({ error: "Please complete the required fields." });
      }

      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceRoleKey) {
        return res.status(503).json({ error: "Pre-launch data collection is not configured yet. Please try again shortly." });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/science_restart_leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: String(name).trim(),
          phone: String(phone).trim(),
          age_range: ageRange,
          previous_background: previousBackground,
          desired_pathway: desiredPathway,
          science_status: scienceStatus,
          biggest_challenge: biggestChallenge,
          last_studied_science: lastStudiedScience,
          employment_status: employmentStatus,
          preferred_schedule: preferredSchedule,
          target_year: targetYear || "2027",
          wants_founding_cohort: Boolean(wantsFoundingCohort),
          willingness_to_pay: willingnessToPay,
          source: source || "website"
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("Supabase lead capture failed:", detail);
        return res.status(502).json({ error: "We could not save your profile. Please try again." });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Lead capture error:", error);
      res.status(500).json({ error: "We could not save your profile. Please try again." });
    }
  });

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

        Measured Topic Performance (weakest first):
        ${JSON.stringify(req.body.topicPerformance || [], null, 2)}

        IMPORTANT: Treat the measured topic performance above as the factual basis for the roadmap. Do not invent topic weaknesses that are not represented there. The four-month prescription must explicitly prioritize the weakest measured topics first, then move toward broader integration and application.
        
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
      res.status(500).json({ error: "Failed to generate learning insight" });
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

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT PORTAL API ROUTES (Connected to persistent disk/database store)
  // ─────────────────────────────────────────────────────────────────────────────

  function getStudentAuth(req: express.Request) {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else if (typeof req.headers['x-portal-token'] === 'string') {
      token = req.headers['x-portal-token'].trim();
    }
    if (!token) return null;
    return portalStore.getStudentByToken(token);
  }

  // Student PIN Login
  app.post("/api/portal/auth/pin", (req, res) => {
    try {
      const { accessCode } = req.body || {};
      if (!accessCode || typeof accessCode !== 'string') {
        return res.status(400).json({ error: "Access code or PIN is required." });
      }
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress || '127.0.0.1';
      const result = portalStore.verifyStudentPIN(accessCode, clientIp);
      if (!result.success || !result.student || !result.token) {
        return res.status(401).json({ error: result.error || "Invalid student PIN." });
      }

      const profile = portalStore.getProfile(result.student.id);
      const plan = portalStore.getLearningPlan(result.student.id);
      const streak = portalStore.getStreak(result.student.id);

      return res.json({
        success: true,
        student: result.student,
        token: result.token,
        profile,
        plan,
        streak
      });
    } catch (err) {
      console.error("PIN auth error:", err);
      return res.status(500).json({ error: "Failed to authenticate PIN." });
    }
  });

  // Student Registration (Self-enrollment)
  app.post("/api/portal/auth/register", (req, res) => {
    try {
      const { name, phone, targetPathway, startingLevel, subjects, currentGoal } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: "Valid student name is required." });
      }
      const newAccount = portalStore.registerNewStudent({
        name,
        phone,
        targetPathway,
        startingLevel,
        subjects,
        currentGoal
      });
      return res.json({
        success: true,
        student: newAccount.student,
        token: newAccount.token,
        accessCode: newAccount.accessCode,
        profile: newAccount.profile,
        plan: newAccount.learningPlan
      });
    } catch (err) {
      console.error("Student register error:", err);
      return res.status(500).json({ error: "Failed to register student." });
    }
  });

  // Current session status
  app.get("/api/portal/me", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired student session." });
    }
    return res.json({
      student,
      profile: portalStore.getProfile(student.id),
      plan: portalStore.getLearningPlan(student.id),
      streak: portalStore.getStreak(student.id)
    });
  });

  // Student Dashboard data
  app.get("/api/portal/dashboard", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized: Please log in with your student PIN." });
    }
    const dashboard = portalStore.getStudentHomeDashboard(student.id);
    if (!dashboard) {
      return res.status(404).json({ error: "Student dashboard not found." });
    }
    return res.json(dashboard);
  });

  // Start or get Daily Fix Practice
  app.post("/api/portal/daily-fix/start", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { customTopic, customSubject } = req.body || {};
    try {
      const practice = portalStore.generateDailyFix(student.id, customTopic, customSubject);
      return res.json(practice);
    } catch (err) {
      console.error("Daily fix start error:", err);
      return res.status(500).json({ error: "Failed to start daily fix clinic." });
    }
  });

  // Submit Daily Fix Practice
  app.post("/api/portal/daily-fix/submit", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { practiceId, submissions } = req.body || {};
    if (!practiceId || !Array.isArray(submissions)) {
      return res.status(400).json({ error: "Practice ID and submissions array are required." });
    }
    try {
      const result = portalStore.submitDailyPracticeAnswers(practiceId, student.id, submissions);
      return res.json(result);
    } catch (err: any) {
      console.error("Daily practice submit error:", err);
      return res.status(400).json({ error: err.message || "Failed to mark daily practice." });
    }
  });

  // List student's assignments
  app.get("/api/portal/assignments", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const assignments = portalStore.getAllAssignmentsForStudent(student.id);
    return res.json({ assignments });
  });

  // Submit Assignment
  app.post("/api/portal/assignments/:id/submit", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { submissions } = req.body || {};
    if (!Array.isArray(submissions)) {
      return res.status(400).json({ error: "Submissions array is required." });
    }
    try {
      const result = portalStore.submitAssignmentAnswers(req.params.id, student.id, submissions);
      return res.json(result);
    } catch (err: any) {
      console.error("Assignment submit error:", err);
      return res.status(400).json({ error: err.message || "Failed to mark assignment." });
    }
  });

  // List student's reading tasks
  app.get("/api/portal/reading-tasks", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const readingTasks = portalStore.getReadingTasksForStudent(student.id);
    return res.json({ readingTasks });
  });

  // Complete Reading Task
  app.post("/api/portal/reading-tasks/:id/complete", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { durationMinutes } = req.body || {};
    const success = portalStore.completeReadingTask(req.params.id, student.id, Number(durationMinutes) || 10);
    if (!success) {
      return res.status(404).json({ error: "Reading task not found or already completed." });
    }
    return res.json({ success: true, streak: portalStore.getStreak(student.id) });
  });

  // Get topic mastery
  app.get("/api/portal/mastery", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const mastery = portalStore.getTopicMasteryForStudent(student.id);
    return res.json({ mastery });
  });

  // Get learning context
  app.get("/api/portal/context", (req, res) => {
    const student = getStudentAuth(req);
    if (!student) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const context = portalStore.buildStudentLearningContext(student.id);
    return res.json(context);
  });

  // Personal tutorial workspace routes share the existing portal database/service layer.
  app.use("/api/tutorial", tutorialRoutes);

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
