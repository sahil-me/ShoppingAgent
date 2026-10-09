import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(500).json({ error: "Gemini API key is missing or misconfigured in Vercel settings." });
  }

  try {
    const input = req.body;
    
    const prompt = `You are a professional party planner and shopping agent. Create a highly accurate, structured shopping plan based on the following input:
    Title: ${input.title || 'Party'}
    Theme: ${input.theme || 'Gathering'}
    Event Type: ${input.eventType || 'cocktail'}
    Adults: ${input.adults || 10}
    Kids: ${input.kids || 0}
    Drinkers: ${input.drinkers || 10}
    Budget: $${input.targetBudget || 200}
    Venue: ${input.venue || 'indoor-home'}
    Dietary Restrictions: ${(input.dietaryRestrictions || []).join(', ')}
    Special Requests: ${input.specialRequests || 'None'}
    
    Return a strictly formatted JSON object matching the required application schema structure containing items, guestCount, beverageMath, and recipes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            theme: { type: Type.STRING },
            eventType: { type: Type.STRING },
            targetBudget: { type: Type.NUMBER },
            agentSummary: { type: Type.STRING },
            guestCount: {
              type: Type.OBJECT,
              properties: {
                adults: { type: Type.NUMBER },
                kids: { type: Type.NUMBER },
                total: { type: Type.NUMBER }
              }
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  store: { type: Type.STRING },
                  aisle: { type: Type.STRING },
                  brandTier: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  purchased: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const dataText = response.text;
    if (!dataText) throw new Error("Empty response received from Gemini.");
    
    return res.status(200).json(JSON.parse(dataText));
  } catch (error: any) {
    console.error("Serverless execution error:", error);
    
    // Check if the error came from Google's high demand / temporary rate limits
    if (error.message && (error.message.includes("503") || error.message.includes("high demand"))) {
      return res.status(503).json({ 
        error: "The party planner is experiencing heavy volume right now. Please try clicking the generation button again in a few seconds!" 
      });
    }
    
    // Standard serverless function fallback
    return res.status(500).json({ 
      error: "The agent encountered an unexpected issue while assembling your shopping plan. Please try creating it again." 
    });
  }
}
