export default async function handler(_req: any, res: any) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ ok: false, database: false, questions: 0 });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/science_restart_questions?select=id&active=eq.true`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    );

    if (!response.ok) return res.status(502).json({ ok: false, database: false, questions: 0 });

    const rows = await response.json();
    const count = Array.isArray(rows) ? rows.length : 0;
    return res.status(200).json({ ok: count >= 400, database: true, questions: count });
  } catch {
    return res.status(500).json({ ok: false, database: false, questions: 0 });
  }
}
