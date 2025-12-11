import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GeneratedPortfolio } from "../types";

export const generatePortfolio = async (input: UserInput): Promise<GeneratedPortfolio> => {
  // Always create a new instance to pick up the latest API Key from process.env which might be set by the key selector
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  // 1. Generate Content (Text JSON)
  const prompt = `
    You are an expert Career Coach and Senior Technical Recruiter.
    Transform the following raw user data into a world-class, high-impact professional portfolio structure.
    
    User Data:
    Name: ${input.fullName}
    Role: ${input.currentRole}
    Raw Bio: ${input.bioRaw}
    Raw Skills: ${input.skillsRaw}
    
    Experience:
    ${JSON.stringify(input.experience)}
    
    Projects:
    ${JSON.stringify(input.projects)}

    Directives:
    1. Create a catchy, professional 'tagline'.
    2. Rewrite the 'professionalSummary' to be engaging and impactful (approx 3-4 sentences).
    3. Categorize the skills logically (e.g., "Frontend", "Backend", "Tools", "Soft Skills").
    4. Enhance experience bullet points to focus on achievements and metrics if possible.
    5. Enhance project descriptions to sound professional and identify a specific "impact" or "result" for each project.
    6. Ensure the tone is confident and modern.
  `;

  // Initiate Text Generation
  const textGenerationPromise = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: "You are a JSON-only generator. You must return valid JSON matching the schema provided.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalBrand: {
            type: Type.OBJECT,
            properties: {
              tagline: { type: Type.STRING },
              professionalSummary: { type: Type.STRING },
              keyStrengths: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["tagline", "professionalSummary", "keyStrengths"]
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["category", "items"]
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                duration: { type: Type.STRING },
                achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["company", "role", "duration", "achievements"]
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                impact: { type: Type.STRING }
              },
              required: ["title", "description", "techStack", "impact"]
            }
          },
          contact: {
            type: Type.OBJECT,
            properties: {
              ctaMessage: { type: Type.STRING }
            },
            required: ["ctaMessage"]
          }
        },
        required: ["personalBrand", "skills", "experience", "projects", "contact"]
      }
    }
  });

  // 2. Generate Image (Parallel)
  const imagePrompt = `A high-quality, abstract, 3D artistic representation of a ${input.currentRole} professional. 
  The image should visually represent proficiency in ${input.skillsRaw}.
  Style: Modern, Minimalist, Tech-Noir, with a color palette of Deep Blue, Rust Orange, and Honey Gold. 
  Lighting: Cinematic, Volumetric. 
  This image will be used as a profile avatar for a professional portfolio.`;

  const imageGenerationPromise = ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: imagePrompt }
      ],
    },
    config: {
      imageConfig: {
        imageSize: input.imageSize, // 1K, 2K, or 4K
        aspectRatio: "1:1"
      }
    }
  }).catch(err => {
    console.error("Image generation failed:", err);
    return null; // Don't fail the whole request if image fails
  });

  // Wait for both
  const [textResponse, imageResponse] = await Promise.all([
    textGenerationPromise,
    imageGenerationPromise
  ]);

  // Process Text
  const text = textResponse.text;
  if (!text) {
    throw new Error("No response generated from Gemini.");
  }

  let portfolioData: GeneratedPortfolio;
  try {
    portfolioData = JSON.parse(text) as GeneratedPortfolio;
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    throw new Error("Failed to parse AI response.");
  }

  // Process Image
  if (imageResponse) {
     for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         portfolioData.heroImage = `data:image/png;base64,${part.inlineData.data}`;
         break;
       }
     }
  }

  return portfolioData;
};