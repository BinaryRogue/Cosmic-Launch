
import { GoogleGenAI } from "@google/genai";
import { PlanetName } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getWukongNarration = async (
  chosen: PlanetName, 
  hit: PlanetName, 
  isSuccess: boolean,
  amount: number
): Promise<string> => {
  if (!process.env.API_KEY) return isSuccess ? `Fortune favors the bold! You claimed ${amount.toFixed(2)} RS.` : "The heavens demand a toll. Your entire stake is lost.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the narrator of a high-stakes gambling game called COSMIC LAUNCH. 
      The player is a 'Destined One' who wagered their celestial wealth (in RS) on a rocket launch.
      They aimed for ${chosen}.
      The rocket hit ${hit}.
      The outcome is ${isSuccess ? 'SUCCESS (Won ' + amount.toFixed(2) + ' RS profit)' : 'FAILURE (Lost entire ' + amount.toFixed(2) + ' RS stake)'}.
      Write a short, epic, 1-sentence atmospheric narration in the style of Wukong game dialogue. 
      Focus on the balance of risk, greed, and the whims of the stars. 
      Do not use common congratulatory words.`,
      config: {
        maxOutputTokens: 60,
        temperature: 0.9,
      }
    });

    return response.text?.trim() || (isSuccess ? "The treasury of the heavens opens for you." : "Greed is a heavy anchor in the celestial sea.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return isSuccess ? "A fortunate strike in the dark." : "The stars do not care for your gold.";
  }
};
