export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  const suppliedKey = req.headers['x-admin-key'];
  if (!configuredKey || typeof suppliedKey !== 'string' || suppliedKey !== configuredKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase is not configured.' });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/science_restart_leads?select=*&order=created_at.desc`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    );

    if (!response.ok) return res.status(502).json({ error: 'Unable to retrieve leads.' });

    const leads = await response.json();
    return res.status(200).json({ leads: Array.isArray(leads) ? leads : [] });
  } catch (error) {
    console.error('Admin lead retrieval error:', error);
    return res.status(500).json({ error: 'Unable to retrieve leads.' });
  }
}
