# AI Resume — AI-Powered Resume Builder

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

An AI-powered resume builder that generates, tailors, and optimises resumes for specific job descriptions using OpenAI GPT-4o. Export to PDF, share a live link, or sync to LinkedIn.

## ✨ Features

- **AI Content Generation** — Paste a job description → AI rewrites your bullet points to match keywords
- **ATS Score** — Analyses resume against job description and gives ATS compatibility score
- **Resume Templates** — 8 professional templates with real-time live preview
- **Rich Editor** — Drag-and-drop section reordering, inline editing
- **PDF Export** — High-fidelity PDF generation via Puppeteer (server-side)
- **Cover Letter AI** — Generates personalised cover letters from your resume + job description
- **Version History** — Save and compare multiple resume versions
- **Share Link** — Public URL for each resume with optional password protection
- **LinkedIn Import** — Import work experience from LinkedIn profile URL
- **Grammar Check** — Passive AI grammar and clarity improvements

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | OpenAI GPT-4o (streaming) |
| PDF | Puppeteer (server-side rendering) |
| Database | Supabase (PostgreSQL + Storage) |
| Auth | Supabase Auth |
| Editor | TipTap (headless rich text editor) |
| Styling | Tailwind CSS |
| Drag & Drop | dnd-kit |
| Deployment | Vercel |

## 🤖 AI Integration

### Job-Tailored Bullet Points

```typescript
// app/api/ai/tailor/route.ts
export async function POST(req: Request) {
  const { bullets, jobDescription } = await req.json();
  
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer and ATS optimization specialist.
          Rewrite the provided resume bullets to match the job description.
          Use strong action verbs, quantify achievements where possible, 
          and incorporate relevant keywords naturally.`
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nCurrent Bullets:\n${bullets}`
      }
    ]
  });

  return new StreamingTextResponse(stream);
}
```

### ATS Score Analysis

```typescript
// Returns structured analysis with score and suggestions
const analysis = await openai.chat.completions.create({
  model: "gpt-4o",
  response_format: { type: "json_object" },
  messages: [{
    role: "user",
    content: `Analyze this resume against the job description and return JSON:
      { score: number, keywords_matched: string[], keywords_missing: string[],
        suggestions: string[], sections_to_improve: string[] }`
  }]
});
```

## 📄 PDF Generation

```typescript
// app/api/resume/export/route.ts
const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setContent(resumeHTML, { waitUntil: "networkidle0" });
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" }
});
await browser.close();

return new Response(pdf, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${name}-resume.pdf"`
  }
});
```

## 🚀 Getting Started

```bash
git clone https://github.com/Tanvin01/ai-resume.git
cd ai-resume
npm install
cp .env.example .env.local
npm run dev
```

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```
