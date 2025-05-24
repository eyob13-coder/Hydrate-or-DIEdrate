// lib/gemini.ts
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function getGeminiResponse(data: Record<string, string>) {
  const { age, weight, hydrationGoal, glassesDrank } = data;

  const prompt = `
You're a hydration coach assistant.

User info:
- Age: ${age}
- Weight: ${weight}kg
- Hydration Goal: ${hydrationGoal} glasses
- Glasses Drank: ${glassesDrank}

Give a short, friendly summary and a hydration tip.
`;

  const { text } = await generateText({
    model: google("gemini-pro"),
    prompt
  });

  return text || "Sorry, I couldn't generate a response.";
}
