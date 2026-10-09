import { portalStore } from '../../../src/server/portalStore';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configured = process.env.ADMIN_DASHBOARD_KEY;
  const supplied = req.headers['x-admin-key'];
  if (!configured || typeof supplied !== 'string' || supplied !== configured) {
    return res.status(401).json({
      error: configured
        ? 'Unauthorized. Check the admin key.'
        : 'ADMIN_DASHBOARD_KEY is not configured for this Vercel deployment.'
    });
  }

  try {
    await portalStore.initializePersistence();
    return res.status(200).json(portalStore.getTeacherDashboard());
  } catch (error) {
    console.error('[Tutorial teacher dashboard]', error);
    return res.status(500).json({ error: 'Unable to load the teacher dashboard.' });
  }
}
