import { QUESTIONS } from '../src/data/questions';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
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

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return res.status(200).json({
            questions: data,
            count: data.length,
          });
        }
      } else {
        console.warn('Supabase question retrieval failed, serving bundled question bank.');
      }
    } catch (supabaseErr) {
      console.warn('Supabase network error, serving bundled question bank:', supabaseErr);
    }
  }

  // Graceful fallback: always serve bundled curriculum questions
  return res.status(200).json({
    questions: QUESTIONS,
    count: QUESTIONS.length,
  });
}

