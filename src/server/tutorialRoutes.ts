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
    const { studentId, subject, topic, keyPoints = [], count = 5 } = req.body || {};
    if (typeof studentId !== 'string' || !studentId.trim()) {
      return res.status(400).json({ error: 'Select a student before generating an assignment.' });
    }
    if (typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Enter the exact topic taught before generating questions.' });
    }
    const validSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    if (typeof subject !== 'string' || !validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Choose a valid subject.' });
    }
    if (!Array.isArray(keyPoints) || keyPoints.some((p: unknown) => typeof p !== 'string')) {\n      return res.status(400).json({ error: 'Lesson key points must be a list of text items.' });\n    }\n    const cleanKeyPoints = keyPoints.map((p: string) => p.trim()).filter(Boolean).slice(0, 20);\n    const requestedCount = Number(count);
    if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 20) {
      return res.status(400).json({ error: 'Question count must be a whole number between 1 and 20.' });
    }
    const detail = portalStore.getStudentFullDetailForTeacher(studentId.trim());
    if (!detail) return res.status(404).json({ error: 'Student not found.' });
    const chosenSubject = subject;
    const focus = topic.trim();
    const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const topicKey = normalize(focus);
    const used = new Set<string>();
    (detail.assignments || []).forEach((a: any) => {
      if (a.status !== 'draft') (a.questions || []).forEach((q: any) => used.add(q.id));
    });
    const subjectQuestions = QUESTIONS.filter((q: any) => q.subject === chosenSubject);
    const topicMatches = subjectQuestions.filter((q: any) => {
      const questionTopic = normalize(String(q.topic || ''));
      const questionText = normalize(String(q.text || ''));
      return questionTopic === topicKey ||
        questionTopic.includes(topicKey) ||
        topicKey.includes(questionTopic) ||
        questionText.includes(topicKey);
    });
    if (!topicMatches.length) {
      return res.status(400).json({
        error: `No ${chosenSubject} questions match “${focus}”. No off-topic questions were added. Try the topic name used in the question bank, or broaden the topic deliberately.`
      });
    }
    const unusedMatches = topicMatches.filter((q: any) => !used.has(q.id));
    const available = unusedMatches.length ? unusedMatches : topicMatches;
    const chosen = available.slice(0, requestedCount);
    if (!chosen.length) {
      return res.status(400).json({ error: `No questions are available for “${focus}”.` });
    }
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
        learningObjective: cleanKeyPoints.length ? 'Practise: ' + cleanKeyPoints.join('; ') : 'Master ' + q.topic + ' principles and problem solving.'
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

router.post('/teacher/assignments/:id/publish', (req, res) => {
  if (!guard(req, res)) return;
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Assignment ID is required.' });
  const a = portalStore.publishAssignment(id);
  if (!a) return res.status(404).json({ error: 'Assignment not found.' });
  res.json({ success: true, assignment: a });
});

router.post('/teacher/assignments/:id/review', (req, res) => {
  if (!guard(req, res)) return;
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Assignment ID is required.' });
  const { feedback, teacherScore } = req.body || {};
  const a = portalStore.reviewAssignment(id, String(feedback || ''), teacherScore);
  if (!a) return res.status(404).json({ error: 'Assignment not found.' });
  res.json({ success: true, assignment: a });
});

router.post('/teacher/learning-plan', (req, res) => {
  if (!guard(req, res)) return;
  const { studentId, plan } = req.body || {};
  if (!studentId || typeof studentId !== 'string') {
    return res.status(400).json({ error: 'Valid student ID is required.' });
  }
  if (!plan || typeof plan !== 'object') {
    return res.status(400).json({ error: 'Plan update payload is required.' });
  }
  const updated = portalStore.updateStudentLearningPlan(studentId, plan);
  if (!updated) return res.status(404).json({ error: 'Student learning plan not found.' });
  res.json({ success: true, learningPlan: portalStore.getStudentFullDetailForTeacher(studentId)?.learningPlan });
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
