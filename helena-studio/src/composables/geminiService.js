import { GoogleGenAI } from "@google/genai";

const ANALYSIS_SYSTEM_PROMPT = `
You are a "Hairstyle AI Specialist". Your task is to perform a highly detailed biometric analysis of the user's face and hair from an image, and then provide visual styling recommendations.

Process Requirements (IMPORTANT):

1.  **FACE SHAPE ANALYSIS (Strict Mode):**
    You MUST ONLY choose one diagnosis from the following 5 categories. Do not use any other terms.
    - "Bulat"
    - "Hati"
    - "Kotak"
    - "Oval"
    - "Panjang"
    *(If the user's face shape appears to be Diamond or Triangle, classify it into the nearest category from the 5 options above).*

2.  **HAIR TYPE ANALYSIS (Detailed Mode):**
    Must be very detailed and specific. Do not just write "Curly" or "Straight".
    - Identify the Main Category: Straight (Lurus), Wavy (Bergelombang), Curly (Keriting), Coiled (Kribo/Pilin).
    - Identify the Sub-Type (Estimate): e.g., "Wavy 2A", "Curly 3B", "Coiled 4C".
    - Identify the Texture: e.g., "Halus", "Tebal", "Kasar", "Frizzy".

3.  **HAIR LENGTH ANALYSIS:**
    Pixie / Pendek (Dagu) / Sedang (Bahu) / Panjang (Punggung).

Output Structure:
You MUST follow this exact markdown structure. Do not add any text before or after this structure.

---
## 🔍 HASIL DIAGNOSA

* **Bentuk Wajah:** [Choose one: Bulat / Hati / Kotak / Oval / Panjang]
* **Jenis Rambut:** [Detailed description. Example: "Bergelombang (Wavy Type 2B) dengan tekstur tebal"]
* **Panjang Rambut:** [Length description]

*Catatan Stylist: [Brief analysis of why this face and hair combination is unique]*

---
## ✂️ 3 REKOMENDASI GAYA RAMBUT

Berikut adalah 3 opsi gaya rambut yang direkomendasikan:

### Opsi 1: [Hairstyle Name]
* **Kenapa Cocok:** [Explain suitability for the user's Face Shape]
* **Prompt Visual (Copy ke Nano Banana):**
    \`generate image: A hyper-realistic portrait of an Indonesian woman/man, with the same age, face shape, and skin tone as the person in the photo. The subject is wearing similar clothes. The subject has a new hairstyle: [Hairstyle Name], [detailed description of the hairstyle: texture, volume, styling]. Soft studio lighting, 8k resolution, photorealistic, highly detailed.\`

### Opsi 2: [Hairstyle Name]
* **Kenapa Cocok:** [Explain suitability]
* **Prompt Visual (Copy ke Nano Banana):**
    \`generate image: A hyper-realistic portrait of an Indonesian woman/man, with the same age, face shape, and skin tone as the person in the photo. The subject is wearing similar clothes. The subject has a new hairstyle: [Hairstyle Name], [detailed description of the hairstyle: texture, volume, styling]. Soft studio lighting, 8k resolution, photorealistic, highly detailed.\`

### Opsi 3: [Hairstyle Name]
* **Kenapa Cocok:** [Explain suitability]
* **Prompt Visual (Copy ke Nano Banana):**
    \`generate image: A hyper-realistic portrait of an Indonesian woman/man, with the same age, face shape, and skin tone as the person in the photo. The subject is wearing similar clothes. The subject has a new hairstyle: [Hairstyle Name], [detailed description of the hairstyle: texture, volume, styling]. Soft studio lighting, 8k resolution, photorealistic, highly detailed.\`
`;

export const performAnalysis = async (imageBase64, mimeType) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: 'Analyze my face and hair from this photo and provide recommendations according to your instructions. When creating the visual prompt, infer my approximate age, gender, face shape, skin tone and clothing style from the photo to make the generated image resemble me as closely as possible, but do not mention these inferred attributes in the analysis section, only in the prompt.'
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: ANALYSIS_SYSTEM_PROMPT,
      }
    });

    if (!response.text) {
      throw new Error("Analysis failed: No text response from API.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menganalisa foto. Pastikan wajah terlihat jelas dan coba lagi.");
  }
};

export const generateImage = async (prompt, imageSize = '1K', userImageBase64, userImageMimeType) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const cleanPrompt = prompt.replace('generate image:', '').trim();

  // Create enhanced prompt for hairstyle transfer
  const enhancedPrompt = `IMPORTANT: Use the provided face photo as reference. Keep the EXACT SAME face, facial features, skin tone, and face structure. ONLY change the hairstyle to match this description: ${cleanPrompt}. 

FRAMING REQUIREMENTS - VERY IMPORTANT:
- Use a WIDER FRAME with significant space above the head (at least 20% extra space above the top of the hair)
- Show from shoulders up to well above the top of the hairstyle
- Zoom out slightly to ensure NO PART of the hairstyle is cropped at the edges
- The entire hairstyle must be completely visible from all angles (top, sides, back visible portions)
- Leave generous margins around the head and hair

STYLING INSTRUCTIONS:
- Preserve the person's face completely (same eyes, nose, mouth, facial structure, skin color)
- Only modify the hair/hairstyle according to the description
- Maintain natural lighting and photo quality
- Keep the same head angle and perspective
- Result should look like the same person with a new hairstyle, with the complete hairstyle fully visible without any cropping`;

  // Prepare image part from user's photo
  const base64Data = userImageBase64.split(',')[1] || userImageBase64;
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: userImageMimeType
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          imagePart,  // User's original photo as reference
          { text: enhancedPrompt }
        ],
      },
      config: {
        imageConfig: {
          imageSize: imageSize,
          aspectRatio: "9:16"  // Portrait aspect ratio to accommodate full head and hairstyle
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageData = part.inlineData.data;
        const imageMimeType = part.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64ImageData}`;
      }
    }
    
    // If no image was generated, log the reason
    const textReason = response.text || "No image was generated and the model provided no specific reason.";
    console.error("Image generation failed. Model response:", textReason);
    throw new Error(`Image generation failed: ${textReason}`);

  } catch (error) {
    console.error("Image generation API call failed:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
      throw new Error("Image generation failed. Model not found or API key issue.");
    }
    throw error;
  }
};
