import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(500).json({ error: "Gemini API key is missing or misconfigured." });
  }

  try {
    const { item, currentPlan } = req.body;

    const prompt = `You are a grocery shopping assistant. Find suitable brand-tier or product alternatives for this specific item: ${JSON.stringify(item || {})}. 
    Context of the active event plan: ${JSON.stringify(currentPlan || {})}. 
    Suggest 3 distinct options (e.g., a generic value option, an organic option, and a bulk package swap) with updated estimated pricing structures.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            substitutions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  store: { type: Type.STRING },
                  brandTier: { type: Type.STRING },
                  dietaryFit: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return res.status(200).json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Substitutions error:", error);
    return res.status(500).json({ error: error.message || "Internal server error." });
  }
}
