export default async function handler(_req: any, res: any) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ ok: false, database: false, questions: 0, distribution_ok: false });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/science_restart_questions?select=subject,profile_level&active=eq.true`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    );

    if (!response.ok) {
      return res.status(502).json({ ok: false, database: false, questions: 0, distribution_ok: false });
    }

    const rows = await response.json();
    const list = Array.isArray(rows) ? rows : [];
    const distribution: Record<string, number> = {};
    for (const row of list) {
      const key = `${row.subject}:${row.profile_level}`;
      distribution[key] = (distribution[key] || 0) + 1;
    }

    const expectedSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const expectedLevels = ['Z', 'F', 'P', 'C'];
    const distributionOk = expectedSubjects.every(subject =>
      expectedLevels.every(level => distribution[`${subject}:${level}`] === 25)
    );

    return res.status(200).json({
      ok: list.length === 400 && distributionOk,
      database: true,
      questions: list.length,
      distribution_ok: distributionOk,
      distribution
    });
  } catch {
    return res.status(500).json({ ok: false, database: false, questions: 0, distribution_ok: false });
  }
}
