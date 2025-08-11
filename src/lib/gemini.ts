import { supabase } from "@/integrations/supabase/client";

export async function askGemini(prompt: string): Promise<string> {
  try {
    // First try the Supabase Edge Function (secure server-side)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { prompt },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!error && data?.text) {
        return data.text;
      }
      
      console.log('Edge function not available or failed, trying local key...');
    }

    // Fallback to local API key
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      return "Gemini não está configurado. Configure no perfil ou peça ao admin para configurar no servidor.";
    }

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
    return "Não foi possível obter resposta do Gemini agora. Verifique a configuração.";
  }
}
