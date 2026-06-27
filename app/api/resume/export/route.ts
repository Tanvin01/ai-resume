import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import puppeteer from "puppeteer";
import { renderResumeToHTML } from "@/lib/resume-renderer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resumeId, templateId } = await req.json();

  const resume = await db.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const html = await renderResumeToHTML(resume, templateId);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.4in", right: "0.4in", bottom: "0.4in", left: "0.4in" },
      preferCSSPageSize: true,
    });

    const candidateName = resume.data?.personalInfo?.fullName ?? "resume";
    const fileName = `${candidateName.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(pdf.length),
      },
    });
  } finally {
    await browser.close();
  }
}
