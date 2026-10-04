export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Question database is not configured.' });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/science_restart_questions?select=id,subject,profile_level,knowledge_type,topic,text,options,explanation,is_math_heavy,text_length,cognitive_skills,difficulty&active=eq.true&order=id.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Supabase question retrieval failed:', await response.text());
      return res.status(502).json({ error: 'Unable to retrieve the question bank.' });
    }

    const data = await response.json();
    return res.status(200).json({
      questions: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0,
    });
  } catch (error) {
    console.error('Question API error:', error);
    return res.status(500).json({ error: 'Unable to retrieve the question bank.' });
  }
}
