import { portalStore } from '../../src/server/portalStore';
import { QUESTIONS } from '../../src/data/questions';

function sendError(res: any, status: number, error: string) {
  return res.status(status).json({ error });
}

export default async function handler(req: any, res: any) {
  try {
    await portalStore.initializePersistence();

    const parts = Array.isArray(req.query?.path)
      ? req.query.path.map(String)
      : String(req.url || '').split('?')[0].replace(/^\/api\/tutorial\/?/, '').split('/').filter(Boolean);
    const route = parts.join('/');
    const supplied = req.headers['x-admin-key'];
    const configured = process.env.ADMIN_DASHBOARD_KEY;

    if (!configured || typeof supplied !== 'string' || supplied !== configured) {
      return sendError(res, 401, 'Admin key is incorrect or ADMIN_DASHBOARD_KEY is not configured in Vercel.');
    }

    if (route === 'teacher/dashboard' && req.method === 'GET') {
      return res.status(200).json(portalStore.getTeacherDashboard());
    }

    if (route === 'teacher/students' && req.method === 'POST') {
      const { name, phone, goal, subjects, level } = req.body || {};
      if (!name || String(name).trim().length < 2) return sendError(res, 400, 'Student name is required.');
      const account = portalStore.registerNewStudent({
        name: String(name),
        phone: String(phone || ''),
        currentGoal: String(goal || ''),
        targetPathway: String(goal || ''),
        startingLevel: level || 'F',
        subjects: Array.isArray(subjects) && subjects.length ? subjects : undefined
      });
      return res.status(200).json({ success: true, student: account.student, accessCode: account.accessCode, profile: account.profile, learningPlan: account.learningPlan });
    }

    if (route.startsWith('teacher/students/') && req.method === 'GET') {
      const id = decodeURIComponent(route.slice('teacher/students/'.length));
      const detail = portalStore.getStudentFullDetailForTeacher(id);
      if (!detail) return sendError(res, 404, 'Student not found.');
      return res.status(200).json(detail);
    }

    if (route === 'teacher/assignment-draft' && req.method === 'POST') {
      const { studentId, subject, topic, count = 5 } = req.body || {};
      const detail = portalStore.getStudentFullDetailForTeacher(studentId);
      if (!detail) return sendError(res, 404, 'Student not found.');
      const plan = detail.learningPlan;
      const focus = String(topic || plan?.subjects?.find((s: any) => s.subject === subject)?.currentTopic || 'Foundation Concepts');
      const used = new Set<string>();
      (detail.assignments || []).forEach((a: any) => (a.questions || []).forEach((q: any) => used.add(q.id)));
      const pool = QUESTIONS.filter((q: any) => q.subject === subject && !used.has(q.id) && (!topic || q.topic.toLowerCase().includes(String(topic).toLowerCase()) || q.text.toLowerCase().includes(String(topic).toLowerCase())));
      const fallback = QUESTIONS.filter((q: any) => q.subject === subject && !used.has(q.id));
      const chosen = (pool.length ? pool : fallback).slice(0, Math.max(1, Math.min(20, Number(count) || 5)));
      if (!chosen.length) return sendError(res, 400, 'No questions available for this subject.');
      const questions = chosen.map((q: any) => {
        const correct = q.options.reduce((p: any, c: any) => p.points > c.points ? p : c, q.options[0]);
        return { id: q.id, text: q.text, type: 'multiple_choice', options: q.options.map((o: any) => ({ id: o.id, text: o.text, points: o.points })), correctOptionId: correct.id, explanation: q.explanation || '', subject: q.subject, topic: q.topic, difficulty: q.difficulty || 2, learningObjective: 'Master ' + q.topic + ' principles and problem solving.' };
      });
      return res.status(200).json({ assignment: { studentId, title: focus + ' Assignment', subject, topic: focus, instructions: 'Complete the questions carefully. Your result will guide the next tutorial step.', questions, difficulty: questions.reduce((a: number, q: any) => a + (q.difficulty || 2), 0) / questions.length, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), estimatedMinutes: Math.max(10, questions.length * 3) } });
    }

    if (route === 'teacher/assignments' && req.method === 'POST') {
      const assignment = portalStore.createAssignment(req.body || {});
      return res.status(200).json({ success: true, assignment });
    }

    if (route === 'teacher/lesson' && req.method === 'POST') {
      const session = portalStore.logTeachingSession(req.body || {});
      return res.status(200).json({ success: true, session });
    }

    if (route.startsWith('teacher/followups/') && route.endsWith('/resolve') && req.method === 'POST') {
      const id = route.slice('teacher/followups/'.length, -'/resolve'.length);
      return res.status(200).json({ success: portalStore.resolveFollowUp(decodeURIComponent(id)) });
    }

    res.setHeader('Allow', 'GET, POST');
    return sendError(res, 404, 'Tutorial API route not found.');
  } catch (error) {
    console.error('[Tutorial API] Request failed:', error);
    return sendError(res, 500, 'The tutorial service encountered an error. Check Vercel function logs.');
  }
}
