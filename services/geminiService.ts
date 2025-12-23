
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItemDetails = async (itemName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a mouth-watering, sophisticated menu description for a high-end restaurant dish named "${itemName}" in the "${category}" category. The description should be evocative, highlighting ingredients and textures. Suggest a premium price in Indian Rupees (INR) and dietary tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            isVegetarian: { type: Type.BOOLEAN },
            isSpicy: { type: Type.BOOLEAN },
          },
          required: ["description", "suggestedPrice", "isVegetarian", "isSpicy"],
        },
      },
    });
    
    let jsonString = response.text || "{}";
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/```$/, "");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating details:", error);
    return null;
  }
};

export const generateItemImage = async (itemName: string, description: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{
          text: `High-end culinary photography of ${itemName}. ${description}. Elegant plating on luxury ceramic, moody restaurant ambient lighting, soft bokeh, 8k resolution, photorealistic, cinematic shadows.`
        }]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const getAISuggestions = async (userPreference: string, menuItems: MenuItem[]) => {
  try {
    const simplifiedMenu = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI Sommelier for 'Paradise Cafe and Restaurant'. A guest says: "${userPreference}". 
      Based on our menu: ${JSON.stringify(simplifiedMenu)}, recommend the top 2-3 items that best match their mood or preference. 
      Explain why each is a perfect choice in a warm, welcoming, and poetic tone.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemId: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ["itemId", "reason"],
          },
        },
      },
    });

    let jsonString = response.text || "[]";
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/```$/, "");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Sommelier error:", error);
    return [];
  }
};
