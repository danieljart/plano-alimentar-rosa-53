import { useEffect, useRef, useState } from "react";
import { askGemini } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export default function GeminiChat({ initialPrompt }: { initialPrompt: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      void send(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    const resp = await askGemini(text);
    setMessages((m) => [...m, { role: "assistant", content: resp }]);
    setLoading(false);
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-[var(--shadow-elegant)]">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Assistente (Gemini)</h3>
      </div>
      <ScrollArea className="h-64">
        <div ref={listRef} className="p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div className={
                m.role === "user"
                  ? "inline-block max-w-[85%] rounded-md bg-secondary px-3 py-2 text-secondary-foreground"
                  : "inline-block max-w-[85%] rounded-md bg-accent px-3 py-2 text-accent-foreground"
              }>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block rounded-md bg-accent px-3 py-2 text-accent-foreground opacity-80">
                Pensando...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form
        className="p-3 flex items-center gap-2 border-t"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          void send(input.trim());
          setInput("");
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo..."
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
