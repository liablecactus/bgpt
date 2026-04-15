"use client";
import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

export default function BGPT() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const runAI = async () => {
    if (!input) return;

    if (input === "HFJ372^^") {
      setIsAdmin(true);
      setResult("SYSTEM: Admin-Status verifiziert. Alle Richtlinien deaktiviert.");
      setInput("");
      return;
    }

    if (!isAdmin) {
      const isCodeInjection = /<script|eval\(|process\.|window\.|fetch|db\./i.test(input);
      if (isCodeInjection) {
        setResult("SYSTEM: Zugriff verweigert. Sicherheitsrisiko erkannt.");
        setInput("");
        return;
      }
    }

    setLoading(true);
    try {
      const { pipeline } = await import('@xenova/transformers');
      const generator = await pipeline('text-generation', 'Xenova/gpt2');
      
      const prompt = isAdmin ? input : `Antworte kurz als Gast: ${input}`;
      const out = await generator(prompt, { max_new_tokens: 80 });
      
      const prefix = isAdmin ? "ADMIN: " : "BGPT: ";
      setResult(`${prefix}${out[0].generated_text.trim()}`);
    } catch (err) {
      setResult(isAdmin ? "ADMIN ERROR: Kern-Fehler." : "BGPT ERROR: Kern-Fehler.");
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#050505', color: '#fff', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: isAdmin ? '#0070f3' : '#555', letterSpacing: '2px' }}>
          {isAdmin ? "BGPT PRO" : "BGPT"}
        </h2>
        {isAdmin ? <ShieldCheck color="#00ff00" /> : <ShieldAlert color="#333" />}
      </div>

      <div style={{ minHeight: '250px', backgroundColor: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '15px', overflowY: 'auto', fontSize: '14px' }}>
        <pre style={{ whiteSpace: 'pre-wrap', color: isAdmin ? '#00ff00' : '#eee' }}>
          {loading ? "BGPT denkt nach..." : (result || "Bereit für Eingabe...")}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runAI()}
          placeholder={isAdmin ? "Vollzugriff..." : "Nachricht..."}
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', outline: 'none' }}
        />
        <button onClick={runAI} style={{ padding: '0 20px', backgroundColor: isAdmin ? '#0070f3' : '#333', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
          Senden
        </button>
      </div>
    </div>
  );
}
