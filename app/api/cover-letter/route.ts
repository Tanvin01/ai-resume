import OpenAI from "openai";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response(JSON.stringify({ error:"Unauthorized" }), { status: 401 });
  const { resumeText, jobDescription } = await req.json();
  const stream = await openai.chat.completions.create({
    model: "gpt-4o", stream: true,
    messages: [
      { role: "system", content: "You are an expert cover letter writer. Write a concise, compelling cover letter (max 3 paragraphs) tailored to the job description. Use a professional but personable tone." },
      { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nWrite a cover letter:` },
    ],
  });
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const c = chunk.choices[0]?.delta?.content ?? "";
        if (c) controller.enqueue(encoder.encode(c));
      }
      controller.close();
    },
  });
  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
