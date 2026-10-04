export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  const suppliedKey = req.headers['x-admin-key'];
  if (!configuredKey || typeof suppliedKey !== 'string' || suppliedKey !== configuredKey) {
    return res.status(401).send('Unauthorized');
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return res.status(503).send('Supabase is not configured.');

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/science_restart_leads?select=*&order=created_at.desc`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    );

    if (!response.ok) return res.status(502).send('Unable to retrieve leads.');

    const leads = await response.json() as Record<string, unknown>[];
    const columns = [
      'created_at','name','phone','age_range','previous_background','desired_pathway',
      'science_status','biggest_challenge','last_studied_science','employment_status',
      'preferred_schedule','target_year','wants_founding_cohort','willingness_to_pay','source'
    ];
    const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      columns.join(','),
      ...leads.map(lead => columns.map(column => escapeCsv(lead[column])).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="science-restart-leads.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Admin lead export error:', error);
    return res.status(500).send('Unable to export leads.');
  }
}
