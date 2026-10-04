import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });

  try {
    const { answers } = req.body || {};
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are an Academic Learning Specialist at Science Restart Academy.
Analyze the following student assessment answers, including time spent and confidence.
Return ONLY valid JSON with:
- "highLevelSummary": an accessible adult-learner summary
- "technicalBreakdown": a detailed academic breakdown
Answers:
${JSON.stringify(answers, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.0 },
    });

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Learning insight API error:', error);
    return res.status(500).json({ error: 'Failed to generate learning insight.' });
  }
}
