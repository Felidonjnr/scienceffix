import { config } from 'dotenv';
config();
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testAITemperatureConsistency() {
  console.log("Testing AI text generation consistency with Temperature = 0.0...");
  
  const dummyData = {
    name: "John",
    courseGoal: "Medicine",
    avgOverall: 45,
    weaknesses: "Mathematics, Physics",
    learningMethod: "Visual"
  };

  const prompt = `Analyze this student data strictly as a clinical academic diagnostician. Provide a 2 sentence summary. Student: ${JSON.stringify(dummyData)}`;

  let previousResult = "";
  let perfectMatches = 0;
  let discrepancies = 0;

  for (let i = 0; i < 3; i++) {
    // Retry logic for 503 errors
    let response;
    let retries = 3;
    while(retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.0,
          }
        });
        break; // Success
      } catch (e: any) {
        if (e.status === 503) {
          retries--;
          console.log(`API Busy, retrying... (${retries} left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw e;
        }
      }
    }
    
    if (!response) throw new Error("API completely failed after retries.");

    const text = response.text;
    if (i === 0) {
      previousResult = text;
      perfectMatches++;
    } else {
      if (text === previousResult) {
        perfectMatches++;
      } else {
        discrepancies++;
        console.log(`Mismatch on run ${i + 1}!`);
        console.log(`Expected: ${previousResult}`);
        console.log(`Got: ${text}`);
      }
    }
    // Artificial delay to prevent rate limits during test
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n--- AI GENERATION RESULTS ---`);
  console.log(`Repeated AI Prompt Runs: 3`);
  console.log(`Perfect Text Matches: ${perfectMatches}`);
  console.log(`Text Discrepancies: ${discrepancies}`);
  console.log(`AI Determinism: ${perfectMatches === 3 ? '100% (Identical Text Generation)' : 'Failed'}`);
}

testAITemperatureConsistency();
