import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title } = await req.json();
  const resume = await (db as any).resume.create({ data: { title, userId: session.user.id, data: {} } });
  return NextResponse.json({ id: resume.id }, { status: 201 });
}
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const resumes = await (db as any).resume.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(resumes);
}
