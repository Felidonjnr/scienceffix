import { portalStore } from '../../src/server/portalStore';

function sendError(res: any, status: number, error: string) {
  return res.status(status).json({ error });
}

function getStudentAuth(req: any) {
  const authHeader = req.headers?.authorization;
  let token = '';
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (typeof req.headers?.['x-portal-token'] === 'string') {
    token = req.headers['x-portal-token'].trim();
  }
  if (!token) return null;
  return portalStore.getStudentByToken(token);
}

export default async function handler(req: any, res: any) {
  try {
    await portalStore.initializePersistence();

    const parts = Array.isArray(req.query?.path)
      ? req.query.path.map(String)
      : String(req.url || '').split('?')[0].replace(/^\/api\/portal\/?/, '').split('/').filter(Boolean);
    const route = parts.join('/');

    // 1. POST /api/portal/auth/pin
    if (route === 'auth/pin') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const rawCode = req.body?.accessCode || req.body?.pin;
      if (!rawCode || typeof rawCode !== 'string' || !rawCode.trim()) {
        return sendError(res, 400, 'Access code or PIN is required.');
      }
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
      const result = portalStore.verifyStudentPIN(rawCode.trim(), clientIp);
      if (!result.success || !result.student || !result.token) {
        return sendError(res, 401, result.error || 'Invalid student PIN.');
      }
      const profile = portalStore.getProfile(result.student.id);
      const plan = portalStore.getLearningPlan(result.student.id);
      const streak = portalStore.getStreak(result.student.id);
      return res.status(200).json({
        success: true,
        student: result.student,
        token: result.token,
        profile,
        plan,
        streak
      });
    }

    // 2. POST /api/portal/auth/register
    if (route === 'auth/register') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const { name, phone, targetPathway, startingLevel, subjects, currentGoal } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return sendError(res, 400, 'Valid student name is required.');
      }
      const newAccount = portalStore.registerNewStudent({
        name: name.trim(),
        phone: typeof phone === 'string' ? phone.trim() : '',
        targetPathway: typeof targetPathway === 'string' ? targetPathway.trim() : undefined,
        startingLevel,
        subjects: Array.isArray(subjects) && subjects.length ? subjects : undefined,
        currentGoal: typeof currentGoal === 'string' ? currentGoal.trim() : undefined
      });
      return res.status(201).json({
        success: true,
        student: newAccount.student,
        token: newAccount.token,
        accessCode: newAccount.accessCode,
        profile: newAccount.profile,
        plan: newAccount.learningPlan
      });
    }

    // 3. GET /api/portal/me
    if (route === 'me') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized: Invalid or expired student session.');
      }
      return res.status(200).json({
        student,
        profile: portalStore.getProfile(student.id),
        plan: portalStore.getLearningPlan(student.id),
        streak: portalStore.getStreak(student.id)
      });
    }

    // 4. POST /api/portal/auth/logout
    if (route === 'auth/logout') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const authHeader = req.headers?.authorization;
      let token = '';
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      } else if (typeof req.headers?.['x-portal-token'] === 'string') {
        token = req.headers['x-portal-token'].trim();
      }
      if (token) {
        portalStore.logoutSession(token);
      }
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }

    // 5. GET /api/portal/dashboard
    if (route === 'dashboard') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized: Please log in with your student PIN.');
      }
      const dashboard = portalStore.getStudentHomeDashboard(student.id);
      if (!dashboard) {
        return sendError(res, 404, 'Student dashboard not found.');
      }
      return res.status(200).json(dashboard);
    }

    // 6. POST /api/portal/daily-fix/start
    if (route === 'daily-fix/start') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const { customTopic, customSubject } = req.body || {};
      const practice = portalStore.generateDailyFix(student.id, customTopic, customSubject);
      return res.status(200).json(practice);
    }

    // 7. POST /api/portal/daily-fix/submit
    if (route === 'daily-fix/submit') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const { practiceId, submissions } = req.body || {};
      if (!practiceId || typeof practiceId !== 'string' || !Array.isArray(submissions) || submissions.length === 0) {
        return sendError(res, 400, 'Practice ID and non-empty submissions array are required.');
      }
      try {
        const result = portalStore.submitDailyPracticeAnswers(practiceId.trim(), student.id, submissions);
        return res.status(200).json(result);
      } catch (err: any) {
        const msg = err?.message || 'Failed to mark daily practice.';
        const status = msg.includes('Unauthorized') || msg.includes('Forbidden') ? 403 : 400;
        return sendError(res, status, msg);
      }
    }

    // 8. GET /api/portal/assignments
    if (route === 'assignments') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const assignments = portalStore.getAllAssignmentsForStudent(student.id);
      return res.status(200).json({ assignments });
    }

    // 8b. GET /api/portal/assignments/:id
    if (parts[0] === 'assignments' && parts.length === 2 && req.method === 'GET') {
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const assignmentId = decodeURIComponent(parts[1]).trim();
      const assignment = portalStore.getAssignmentForStudent(assignmentId, student.id);
      if (!assignment) {
        return sendError(res, 404, 'Assignment not found.');
      }
      return res.status(200).json({ assignment });
    }

    // 9. POST /api/portal/assignments/:id/submit
    if (parts[0] === 'assignments' && parts.length === 3 && parts[2] === 'submit') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const assignmentId = decodeURIComponent(parts[1]).trim();
      const { submissions } = req.body || {};
      if (!assignmentId || !Array.isArray(submissions) || submissions.length === 0) {
        return sendError(res, 400, 'Valid assignment ID and non-empty submissions array are required.');
      }
      try {
        const result = portalStore.submitAssignmentAnswers(assignmentId, student.id, submissions);
        return res.status(200).json(result);
      } catch (err: any) {
        const msg = err?.message || 'Failed to mark assignment.';
        const status = msg.includes('Unauthorized') || msg.includes('Forbidden') ? 403 : (msg.includes('not found') ? 404 : 400);
        return sendError(res, status, msg);
      }
    }

    // 9. GET /api/portal/reading-tasks
    if (route === 'reading-tasks') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const readingTasks = portalStore.getReadingTasksForStudent(student.id);
      return res.status(200).json({ readingTasks });
    }

    // 10. POST /api/portal/reading-tasks/:id/complete
    if (parts[0] === 'reading-tasks' && parts.length === 3 && parts[2] === 'complete') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const taskId = decodeURIComponent(parts[1]);
      const { durationMinutes } = req.body || {};
      const success = portalStore.completeReadingTask(taskId, student.id, Number(durationMinutes) || 10);
      if (!success) {
        return sendError(res, 404, 'Reading task not found or already completed.');
      }
      return res.status(200).json({ success: true, streak: portalStore.getStreak(student.id) });
    }

    // 11. GET /api/portal/mastery
    if (route === 'mastery') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const mastery = portalStore.getTopicMasteryForStudent(student.id);
      return res.status(200).json({ mastery });
    }

    // 12. GET /api/portal/context
    if (route === 'context') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendError(res, 405, 'Method not allowed');
      }
      const student = getStudentAuth(req);
      if (!student) {
        return sendError(res, 401, 'Unauthorized');
      }
      const context = portalStore.buildStudentLearningContext(student.id);
      return res.status(200).json(context);
    }

    // Unknown portal route
    return sendError(res, 404, `Portal API route not found: ${req.method} /api/portal/${route}`);
  } catch (error) {
    console.error('[Portal API] Request failed:', error);
    return sendError(res, 500, 'The portal service encountered an error. Check Vercel function logs.');
  }
}
