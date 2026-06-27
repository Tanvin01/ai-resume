"use client";
import { useState } from "react";
import { FileText, Download } from "lucide-react";
const TEMPLATES = [
  { id: "minimal", name: "Minimal", desc: "Clean single-column layout" },
  { id: "modern", name: "Modern", desc: "Two-column with accent colour" },
  { id: "executive", name: "Executive", desc: "Classic professional format" },
  { id: "creative", name: "Creative", desc: "Bold headers, visual hierarchy" },
];
interface Props { selectedId: string; onSelect: (id: string) => void; }
export default function TemplatePicker({ selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)}
          className={`p-4 rounded-xl border text-left transition-all ${selectedId===t.id ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
          <div className="flex items-center gap-2 mb-1"><FileText className={`w-4 h-4 ${selectedId===t.id?"text-blue-400":"text-slate-400"}`}/><span className="font-medium text-white text-sm">{t.name}</span></div>
          <p className="text-xs text-slate-500">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}
