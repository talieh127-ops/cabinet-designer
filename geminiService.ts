
import { GoogleGenAI, Type } from "@google/genai";
import { CabinetSpecs, DesignResult } from "../types";

export const generateCabinetDesign = async (
  imageUri: string,
  specs: CabinetSpecs
): Promise<DesignResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const promptText = `
    سبک: ${specs.style}
    رنگ: ${specs.color}
    متریال: ${specs.material}
    نوع دستگیره: ${specs.handleType}
    جزیره: ${specs.hasIsland ? 'دارد' : 'ندارد'}
    نوع کابینت: ${specs.cabinetType}
    توضیحات تکمیلی: ${specs.extraNotes}
  `;

  // 1. Generate Redesigned Image
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageUri.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `Redesign the kitchen cabinets in this image based on these specs: ${promptText}. Keep the floor, walls, and layout identical. Only change cabinets and countertops. High realism, architectural photography style.`,
        },
      ],
    },
  });

  let redesignedImageUrl = '';
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      redesignedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  // 2. Generate Technical Data (JSON)
  const planResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageUri.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `با توجه به این تصویر و این مشخصات: ${promptText}، یک نقشه اجرایی دقیق و لیست برش (Cut List) برای نجار ارائه بده.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          technicalDescription: {
            type: Type.STRING,
            description: "توضیحات کامل فنی شامل پلان، نماها و استانداردهای اجرایی به زبان فارسی.",
          },
          cutList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                row: { type: Type.INTEGER },
                partName: { type: Type.STRING, description: "نام قطعه (مثلاً: دیواره زمینی)" },
                length: { type: Type.NUMBER, description: "طول به سانتی‌متر" },
                width: { type: Type.NUMBER, description: "عرض به سانتی‌متر" },
                count: { type: Type.INTEGER, description: "تعداد قطعه" },
                pvc: { type: Type.STRING, description: "وضعیت لبه PVC (مثلاً: ۲ طول ۲ عرض)" },
              },
              required: ["row", "partName", "length", "width", "count", "pvc"],
            },
          },
        },
        required: ["technicalDescription", "cutList"],
      },
      systemInstruction: "تو یک کارشناس فنی کابینت‌سازی هستی. خروجی باید کاملاً دقیق و قابل اجرا در کارگاه باشد. لیست برش را با دقت میلی‌متری و بر اساس ابعاد استاندارد یا توضیحات کاربر محاسبه کن.",
    }
  });

  try {
    const data = JSON.parse(planResponse.text || '{}');
    return {
      imageUrl: redesignedImageUrl,
      technicalDescription: data.technicalDescription || 'توضیحات موجود نیست.',
      cutList: data.cutList || [],
    };
  } catch (e) {
    console.error("JSON Parse Error", e);
    throw new Error("خطا در پردازش اطلاعات فنی هوش مصنوعی.");
  }
};
