export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name, phone, ageRange, previousBackground, desiredPathway, scienceStatus,
    biggestChallenge, lastStudiedScience, employmentStatus, preferredSchedule,
    targetYear, wantsFoundingCohort, willingnessToPay, source
  } = req.body || {};

  if (!name || !phone || !ageRange || !desiredPathway || !scienceStatus || !biggestChallenge) {
    return res.status(400).json({ error: 'Please complete the required fields.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Pre-launch data collection is not configured yet. Please try again shortly.' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/science_restart_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: String(name).trim(),
        phone: String(phone).trim(),
        age_range: ageRange,
        previous_background: previousBackground,
        desired_pathway: desiredPathway,
        science_status: scienceStatus,
        biggest_challenge: biggestChallenge,
        last_studied_science: lastStudiedScience,
        employment_status: employmentStatus,
        preferred_schedule: preferredSchedule,
        target_year: targetYear || '2027',
        wants_founding_cohort: Boolean(wantsFoundingCohort),
        willingness_to_pay: willingnessToPay,
        source: source || 'website',
      }),
    });

    if (!response.ok) {
      console.error('Supabase lead capture failed:', await response.text());
      return res.status(502).json({ error: 'We could not save your profile. Please try again.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Lead API error:', error);
    return res.status(500).json({ error: 'We could not save your profile. Please try again.' });
  }
}
