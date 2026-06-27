"use client";
import { useState } from "react";
import { Target, CheckCircle, XCircle } from "lucide-react";
export default function ATSScoreCard() {
  const [jd, setJd] = useState(""); const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false);
  const analyze = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/ats-score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeText, jobDescription: jd }) });
    setResult(await res.json()); setLoading(false);
  };
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-green-400" />ATS Score</h3>
      {!result ? (
        <div className="space-y-3">
          <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text..." className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
          <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste job description..." className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
          <button onClick={analyze} disabled={loading || !jd || !resumeText} className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white py-2 rounded-xl text-sm font-medium">
            {loading ? "Analyzing..." : "Check ATS Score"}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold text-white">{result.score}</div>
            <div><div className={`text-2xl font-bold ${result.grade === "A" ? "text-green-400" : result.grade === "B" ? "text-blue-400" : "text-yellow-400"}`}>Grade {result.grade}</div><p className="text-slate-400 text-xs mt-1">{result.summary?.slice(0,80)}...</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-green-400 font-medium mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Matched</p>{result.keywords_matched?.slice(0,4).map((k: string) => <span key={k} className="inline-block bg-green-500/10 text-green-300 text-xs rounded px-2 py-0.5 mr-1 mb-1">{k}</span>)}</div>
            <div><p className="text-xs text-red-400 font-medium mb-1 flex items-center gap-1"><XCircle className="w-3 h-3" />Missing</p>{result.keywords_missing?.slice(0,4).map((k: string) => <span key={k} className="inline-block bg-red-500/10 text-red-300 text-xs rounded px-2 py-0.5 mr-1 mb-1">{k}</span>)}</div>
          </div>
          <button onClick={() => setResult(null)} className="mt-3 text-xs text-slate-400 hover:text-white">Analyze again</button>
        </div>
      )}
    </div>
  );
}
