export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({
    status: 'ok',
    service: 'ScienceFix Student Portal API',
    endpoints: [
      'POST /api/portal/auth/pin',
      'POST /api/portal/auth/register',
      'GET /api/portal/dashboard',
      'GET /api/portal/assignments',
      'POST /api/portal/assignments/:id/submit',
      'POST /api/portal/daily-fix/start',
      'POST /api/portal/daily-fix/submit',
      'GET /api/portal/reading-tasks',
      'POST /api/portal/reading-tasks/:id/complete',
      'GET /api/portal/mastery',
      'GET /api/portal/context',
      'GET /api/portal/me'
    ]
  });
}
