import OpenAI from "openai";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { bullets, jobDescription } = await req.json();

  if (!bullets || !jobDescription) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer and ATS optimization specialist with 15 years of experience.
Your goal is to rewrite resume bullet points to:
1. Match the keywords and requirements in the job description
2. Use strong action verbs (Led, Built, Architected, Reduced, Increased, etc.)
3. Quantify achievements where possible (%, $, time saved, users, scale)
4. Incorporate relevant technical keywords naturally
5. Keep each bullet under 2 lines
Return only the rewritten bullets, one per line, starting with •`,
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nCurrent Resume Bullets:\n${bullets}`,
      },
    ],
  });

  // Return as a streaming response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content ?? "";
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
