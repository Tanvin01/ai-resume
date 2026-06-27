import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ATSAnalysis {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  keywords_matched: string[];
  keywords_missing: string[];
  suggestions: string[];
  sections_to_improve: string[];
  summary: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resumeText, jobDescription } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "keywords_matched": [<matched keywords>],
  "keywords_missing": [<important missing keywords>],
  "suggestions": [<up to 5 actionable improvements>],
  "sections_to_improve": [<section names>],
  "summary": "<2-3 sentence overall assessment>"
}`,
      },
      {
        role: "user",
        content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
  });

  const analysis: ATSAnalysis = JSON.parse(
    response.choices[0].message.content ?? "{}"
  );

  return NextResponse.json(analysis);
}
