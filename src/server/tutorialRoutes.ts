import { Router, Request, Response } from 'express';
import { portalStore, verifyAdminKey } from './portalStore';
import { QUESTIONS } from '../data/questions';

const router = Router();
const guard = (req: Request, res: Response) => {
  if (!verifyAdminKey(req.headers['x-admin-key'])) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' });
    return false;
  }
  return true;
};

router.get('/teacher/dashboard', (req, res) => {
  if (!guard(req, res)) return;
  res.json(portalStore.getTeacherDashboard());
});

router.get('/teacher/students/:id', (req, res) => {
  if (!guard(req, res)) return;
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Student ID is required.' });
  const data = portalStore.getStudentFullDetailForTeacher(id);
  if (!data) return res.status(404).json({ error: 'Student not found.' });
  res.json(data);
});

router.post('/teacher/students', (req, res) => {
  if (!guard(req, res)) return;
  try {
    const { name, phone, goal, subjects, level } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: 'Student name is required and must be at least 2 characters.' });
    }
    const account = portalStore.registerNewStudent({
      name: String(name).trim(),
      phone: String(phone || '').trim(),
      currentGoal: String(goal || '').trim(),
      targetPathway: String(goal || '').trim(),
      startingLevel: level || 'F',
      subjects: Array.isArray(subjects) && subjects.length ? subjects : undefined
    });
    res.status(201).json({
      success: true,
      student: account.student,
      accessCode: account.accessCode,
      profile: account.profile,
      learningPlan: account.learningPlan
    });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Could not create student.' });
  }
});

router.post('/teacher/assignment-draft', (req, res) => {
  if (!guard(req, res)) return;
  try {
    const { studentId, subject, topic, count = 5 } = req.body || {};
    if (!studentId || typeof studentId !== 'string' || !studentId.trim()) {
      return res.status(400).json({ error: 'Student ID is required.' });
    }
    const detail = portalStore.getStudentFullDetailForTeacher(studentId.trim());
    if (!detail) return res.status(404).json({ error: 'Student not found.' });
    const plan = detail.learningPlan;
    const chosenSubject = subject || plan?.subjects?.[0]?.subject || 'Biology';
    const focus = String(topic || plan?.subjects?.find((s: any) => s.subject === chosenSubject)?.currentTopic || 'Foundation Concepts');
    const used = new Set<string>();
    (detail.assignments || []).forEach((a: any) => (a.questions || []).forEach((q: any) => used.add(q.id)));
    const pool = QUESTIONS.filter((q: any) => q.subject === chosenSubject && !used.has(q.id) && (!topic || q.topic.toLowerCase().includes(String(topic).toLowerCase()) || q.text.toLowerCase().includes(String(topic).toLowerCase())));
    const fallback = QUESTIONS.filter((q: any) => q.subject === chosenSubject && !used.has(q.id));
    const chosen = (pool.length ? pool : fallback).slice(0, Math.max(1, Math.min(20, Number(count) || 5)));
    if (!chosen.length) return res.status(400).json({ error: 'No questions available for this subject.' });
    const questions = chosen.map((q: any) => {
      const correct = q.options.reduce((p: any, c: any) => p.points > c.points ? p : c, q.options[0]);
      return {
        id: q.id,
        text: q.text,
        type: 'multiple_choice',
        options: q.options.map((o: any) => ({ id: o.id, text: o.text, points: o.points })),
        correctOptionId: correct.id,
        explanation: q.explanation || '',
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty || 2,
        learningObjective: 'Master ' + q.topic + ' principles and problem solving.'
      };
    });
    res.json({
      assignment: {
        studentId: studentId.trim(),
        title: focus + ' Assignment',
        subject: chosenSubject,
        topic: focus,
        instructions: 'Complete the questions carefully. Your result will guide the next tutorial step.',
        questions,
        difficulty: questions.reduce((a: any, q: any) => a + (q.difficulty || 2), 0) / questions.length,
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        estimatedMinutes: Math.max(10, questions.length * 3)
      }
    });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Could not generate assignment.' });
  }
});

router.post('/teacher/assignments', (req, res) => {
  if (!guard(req, res)) return;
  try {
    const a = portalStore.createAssignment(req.body);
    res.status(201).json({ success: true, assignment: a });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Could not publish assignment.' });
  }
});

router.post('/teacher/lesson', (req, res) => {
  if (!guard(req, res)) return;
  try {
    const session = portalStore.logTeachingSession(req.body);
    res.status(201).json({ success: true, session });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Could not save lesson.' });
  }
});

router.post('/teacher/followups/:id/resolve', (req, res) => {
  if (!guard(req, res)) return;
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Follow-up ID is required.' });
  const success = portalStore.resolveFollowUp(id);
  if (!success) return res.status(404).json({ error: 'Follow-up item not found.' });
  res.json({ success: true });
});

export default router;
