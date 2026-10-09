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
      model: 'gemini-3.8-flash',
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
    
    // Check if the error came from Google's high demand / temporary rate limits
    if (error.message && (error.message.includes("503") || error.message.includes("high demand"))) {
      return res.status(503).json({ 
        error: "The agent is handling a lot of substitution requests right now. Please try looking for alternatives again in a few moments!" 
      });
    }
    
    // Standard serverless function fallback
    return res.status(500).json({ 
      error: "The agent encountered an unexpected issue finding alternative items. Please try again." 
    });
  }
}
