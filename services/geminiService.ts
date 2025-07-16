import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResultItem } from '../types';

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: "The main topic or subject area from the syllabus (e.g., 'Cellular Biology', 'Genetics').",
      },
      intendedLearningOutcome: {
        type: Type.STRING,
        description: "The specific Intended Learning Outcome (ILO) from the syllabus that the exam question assesses.",
      },
      questionNumber: {
        type: Type.STRING,
        description: "The corresponding question number from the exam (e.g., '1', '2', 'Section B, Q3').",
      },
      bloomsLevel: {
        type: Type.STRING,
        description: "The classification of the question based on Bloom's Taxonomy: Remembering, Understanding, Applying, Analyzing, Evaluating, or Creating.",
      },
      suggestedItemPlacement: {
        type: Type.STRING,
        description: "A brief, actionable suggestion for where this item fits best in the test (e.g., 'Keep as is', 'Good for formative assessment', 'Move to Section B for higher-order skills').",
      },
      suggestedTOS_TableRow: {
        type: Type.STRING,
        description: "A concise summary for a Table of Specifications (TOS) row, combining the topic and skill (e.g., 'Genetics: Applying principles').",
      },
    },
    required: ["topic", "intendedLearningOutcome", "questionNumber", "bloomsLevel", "suggestedItemPlacement", "suggestedTOS_TableRow"],
  },
};

export const analyzeSyllabusAndExam = async (syllabus: string, exam: string): Promise<AnalysisResultItem[]> => {
  if (!process.env.API_KEY) {
    // This error will be caught by the try/catch in App.tsx and displayed to the user.
    throw new Error("API_KEY is not configured. Please ensure it is set up in your environment to use the AI features.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    As an expert in educational assessment and curriculum design, your task is to analyze the provided syllabus and exam content.

    **Instructions:**
    1.  Read the syllabus carefully, paying close attention to the "Intended Learning Outcomes" (ILOs).
    2.  For each question in the exam, find the most relevant ILO from the syllabus.
    3.  Classify each exam question according to Bloom's Taxonomy: Remembering, Understanding, Applying, Analyzing, Evaluating, or Creating.
    4.  Provide a suggestion for item placement and a row for a Table of Specifications (TOS).
    5.  Format the entire output as a JSON array of objects, strictly adhering to the provided schema. Each object in the array represents one exam question.

    **Syllabus Content:**
    ---
    ${syllabus}
    ---

    **Exam Content:**
    ---
    ${exam}
    ---

    Now, perform the analysis and generate the JSON output.
  `;

  // The try/catch from App.tsx will handle errors from this call.
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const jsonText = response.text.trim();
  const parsedResult = JSON.parse(jsonText);
  
  // Basic validation to ensure we have an array of objects
  if (!Array.isArray(parsedResult) || (parsedResult.length > 0 && typeof parsedResult[0] !== 'object')) {
      throw new Error("API returned data in an unexpected format.");
  }

  return parsedResult as AnalysisResultItem[];
};
