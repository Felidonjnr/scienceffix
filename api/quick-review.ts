import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });

  try {
    const { task } = req.body || {};
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are a foundational science tutor at Science Restart Academy.
Study task: "${String(task || '').slice(0, 500)}"
Return ONLY valid JSON with one field "reviewContent" containing a concise, useful review for an adult learner.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.0 },
    });

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Quick review API error:', error);
    return res.status(500).json({ error: 'Failed to generate quick review.' });
  }
}
