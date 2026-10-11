export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({
    status: 'ok',
    service: 'ScienceFix Teacher Tutorial API',
    endpoints: [
      'GET /api/tutorial/teacher/dashboard',
      'GET /api/tutorial/teacher/students/:id',
      'POST /api/tutorial/teacher/students',
      'POST /api/tutorial/teacher/assignment-draft',
      'POST /api/tutorial/teacher/assignments',
      'POST /api/tutorial/teacher/lesson',
      'POST /api/tutorial/teacher/followups/:id/resolve'
    ]
  });
}
