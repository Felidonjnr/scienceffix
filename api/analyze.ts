import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'DEEPSEEK_API_KEY is not configured.' });

  try {
    const { student, answers, report, topicPerformance } = req.body || {};
    const openai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey });

    const prompt = `
You are the Academic Director and Foundational Learning Specialist at Science Restart Academy.
The Academy helps learners rebuild science foundations before progressing toward science-related education or careers.

Candidate Profile:
${JSON.stringify(student, null, 2)}

Raw Score & Performance Data:
${JSON.stringify(report, null, 2)}

Answers:
${JSON.stringify(answers, null, 2)}

Measured Topic Performance (weakest first):
${JSON.stringify(topicPerformance || [], null, 2)}

Treat measured topic performance as factual. Do not invent weaknesses not represented by the data.
Analyze behavioral metrics and cognitive patterns where available.
Return ONLY a valid JSON object with:
{
  "hiddenBottleneck": "diagnostic paragraph",
  "unfairAdvantage": ["principle 1", "principle 2", "principle 3"],
  "sevenDayBlueprint": ["Day 1: ...", "Day 2: ...", "Day 3: ...", "Day 4: ...", "Day 5: ...", "Day 6: ...", "Day 7: ..."],
  "fourMonthPrescription": ["Month 1: ...", "Month 2: ...", "Month 3: ...", "Month 4: ..."]
}
`;

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.0,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response generated');
    return res.status(200).json(JSON.parse(content));
  } catch (error) {
    console.error('Analysis API error:', error);
    return res.status(500).json({ error: 'Failed to generate AI analysis.' });
  }
}
