import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

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
    
    // Check if the error came from Google's high demand / rate limits
    if (error.message && (error.message.includes("503") || error.message.includes("high demand"))) {
      return res.status(503).json({ 
        error: "The AI agent is currently experiencing high volume. Please click the button to try again in a moment!" 
      });
    }
    
    // Standard fallback fallback message
    return res.status(500).json({ 
      error: "The shopping agent encountered an unexpected issue. Please try sending your message again." 
    });
  }
}
