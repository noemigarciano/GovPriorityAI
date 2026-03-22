import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ServiceCategory {
  id: string;
  name: string;
  prefix: string;
  description: string;
}

export const SERVICES: ServiceCategory[] = [
  { id: "general", name: "General Inquiries", prefix: "G", description: "Information desk, form requests, and general questions." },
  { id: "licensing", name: "Licensing & Permits", prefix: "L", description: "Driver's licenses, business permits, and professional certifications." },
  { id: "civil", name: "Civil Registry", prefix: "C", description: "Birth, marriage, and death certificates." },
  { id: "tax", name: "Tax & Revenue", prefix: "T", description: "Property taxes, income tax filing, and payments." },
  { id: "social", name: "Social Services", prefix: "S", description: "Health benefits, pension, and social welfare programs." },
  { id: "priority", name: "Priority Lane", prefix: "P", description: "Seniors, PWDs, pregnant women, and people with infants." },
];

export async function categorizeRequest(userInput: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize the following government office visit request into one of these categories: ${SERVICES.map(s => `${s.id} (${s.name}: ${s.description})`).join(", ")}. 
      
      User input: "${userInput}"
      
      Return ONLY a JSON object with the "categoryId" and a brief "reasoning". If it's a priority case (Senior, PWD, etc.), prioritize the "priority" category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryId: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            isPriority: { type: Type.BOOLEAN }
          },
          required: ["categoryId", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return { categoryId: "general", reasoning: "Defaulted due to error" };
  }
}
