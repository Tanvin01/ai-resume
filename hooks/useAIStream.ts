import { useState, useCallback } from "react";
export function useAIStream(endpoint: string) {
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false);
  const run = useCallback(async (body: Record<string, string>) => {
    setLoading(true); setOutput("");
    const res = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
    if (!res.ok) { setLoading(false); throw new Error("Request failed"); }
    const reader = res.body?.getReader(); const decoder = new TextDecoder();
    if (!reader) return;
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setOutput(text);
    }
    setLoading(false);
  }, [endpoint]);
  return { output, loading, run, setOutput };
}
