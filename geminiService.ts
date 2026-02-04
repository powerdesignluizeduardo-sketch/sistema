
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "./types";

export async function generateMoreRecipes(categoryName: string, categoryDescription: string): Promise<Recipe[]> {
  // Initialize right before use to ensure process.env.API_KEY is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um nutricionista funcional. Gere 3 novas receitas para a categoria "${categoryName}" (${categoryDescription}). 
    Siga estritamente este formato JSON:
    [
      {
        "id": "string único",
        "name": "Nome Criativo",
        "time": "X",
        "difficulty": "Fácil/Médio",
        "functionalAction": "Explicação curta do benefício funcional",
        "ingredients": ["item 1", "item 2"],
        "steps": ["passo 1", "passo 2"],
        "chefTip": "opcional",
        "category": "${categoryName}"
      }
    ]`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            functionalAction: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            chefTip: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "name", "time", "difficulty", "functionalAction", "ingredients", "steps", "category"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}