import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

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
    const { message, currentPlan, chatHistory } = req.body;

    const systemInstruction = `You are an expert conversational AI Party Planner Shopping Agent. 
    Help the user refine their active party plan or suggest adjustments like substitutions or budget balances.
    Active Plan Context: ${JSON.stringify(currentPlan || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [...(chatHistory || []).map((m: any) => m.text), message],
      config: {
        systemInstruction: systemInstruction
      }
    });

    return res.status(200).json({ 
      text: response.text || "I'm sorry, I couldn't process that request.",
      suggestedAction: null 
    });
  } catch (error: any) {
    console.error("Chat Serverless execution error:", error);
    return res.status(500).json({ error: error.message || "Internal server error during agent conversation." });
  }
}
