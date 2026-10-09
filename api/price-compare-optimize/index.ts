import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  maxDuration: 60, // Sets maximum execution limit to 60 seconds
};

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
    const { items, targetBudget } = req.body;

    const prompt = `You are a shopping budget optimization assistant. Look at these items: ${JSON.stringify(items || [])}. 
    The current target budget is $${targetBudget || 200}. Optimize this shopping list to maximize cost efficiency without losing essential items. Suggest direct swaps for generic value alternatives where possible. 
    Return a strictly formatted JSON object containing an array of the optimized items matching the application schema structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedItems: {
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

    const data = JSON.parse(response.text || "{}");
    return res.status(200).json(data.optimizedItems || items);
  } catch (error: any) {
    console.error("Price optimize error:", error);
    
    // Check if the error came from Google's high demand / temporary rate limits
    if (error.message && (error.message.includes("503") || error.message.includes("high demand"))) {
      return res.status(503).json({ 
        error: "The budget optimizer is experiencing high volume right now. Please try optimizing your list again in a few seconds!" 
      });
    }
    
    // Standard serverless function fallback
    return res.status(500).json({ 
      error: "The agent encountered an unexpected issue while optimizing your prices. Please try again." 
    });
  }
}
