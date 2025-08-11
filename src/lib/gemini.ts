// Simple Gemini client for frontend-only usage
// NOTE: For production, prefer routing via a Supabase Edge Function with the API key stored in Supabase Secrets.

export async function askGemini(prompt: string): Promise<string> {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    return "Gemini não está configurado. Adicione sua chave em localStorage (gemini_api_key) ou peça para conectarmos via Supabase Secrets.";
  }
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          ],
        }),
      }
    );
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${txt}`);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text || "Sem resposta no momento.";
  } catch (e: any) {
    console.error(e);
    return "Não foi possível obter resposta do Gemini agora. Verifique sua chave e tente novamente.";
  }
}
