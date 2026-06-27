import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, FileText, Download } from "lucide-react";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const resumes = await (db as any).resume.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-white">My Resumes</h1><p className="text-slate-400 text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p></div>
          <Link href="/resume/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium"><Plus className="w-4 h-4" />New Resume</Link>
        </div>
        {resumes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-2xl">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No resumes yet. Create your first one.</p>
            <Link href="/resume/new" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm">Get Started</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {resumes.map((r: any) => (
              <div key={r.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all">
                <h3 className="font-medium text-white truncate">{r.title}</h3>
                <p className="text-slate-500 text-xs mt-1">Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/resume/${r.id}`} className="flex-1 text-center text-xs bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg">Edit</Link>
                  <a href={`/api/resume/export?id=${r.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg"><Download className="w-3.5 h-3.5 text-slate-300" /></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
