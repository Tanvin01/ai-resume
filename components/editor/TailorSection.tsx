"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";
export default function TailorSection({ resumeId }: { resumeId: string }) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const handleTailor = useCallback(async () => {
    if (!jobDesc.trim()) return toast.error("Paste a job description first");
    setLoading(true); setResult("");
    const res = await fetch("/api/ai/tailor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jobDesc, resumeId }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) { setLoading(false); return; }
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setResult(text);
    }
    setLoading(false);
  }, [jobDesc, resumeId]);
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-blue-400" />AI Tailor</h3>
      <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description here..."
        className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none mb-3" />
      <button onClick={handleTailor} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : "Tailor My Resume"}
      </button>
      {result && <pre className="mt-4 text-sm text-slate-300 whitespace-pre-wrap bg-slate-800 rounded-xl p-4 max-h-64 overflow-y-auto">{result}</pre>}
    </div>
  );
}
