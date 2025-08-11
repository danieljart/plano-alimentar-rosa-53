import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeminiChat from "@/components/GeminiChat";
import JackpotNumber from "@/components/JackpotNumber";
import { askGemini } from "@/lib/gemini";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, LabelList } from "recharts";
import { FoodItem } from "@/data/foods";
import { generateWeek, generateDay, portionLabel } from "@/lib/plan/generator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Bot, Printer } from "lucide-react";

type Meal = {
  nome: string;
  itens: FoodItem[];
  calorias: number;
  image: string;
  hora: string;
};

type DayPlan = { dia: string; refeicoes: Meal[]; totalKcal: number };

type Distribution = { [key: string]: number };

const dist: Distribution = {
  "Café": 0.2,
  "Colação": 0.1,
  "Almoço": 0.3,
  "Lanche": 0.1,
  "Jantar": 0.25,
  "Ceia": 0.05,
};


const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export default function Plan() {
  const [prefs, setPrefs] = useState<{ caloriasDiarias: number; gostaIds: string[] } | null>(null);
  const [tab, setTab] = useState<string>(() => localStorage.getItem("planCurrentDay") || "Seg");
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [mealModalIdx, setMealModalIdx] = useState<number | null>(null);
  const [mealSuggestions, setMealSuggestions] = useState<Meal[]>([]);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [tips, setTips] = useState<string>("");
  const [tipsLoading, setTipsLoading] = useState(false);
  useEffect(() => {
    const p = localStorage.getItem("onboardingPrefs");
    if (!p) {
      toast("Precisamos das suas preferências primeiro");
      window.location.href = "/onboarding";
      return;
    }
    const parsed = JSON.parse(p);
    setPrefs(parsed);
  }, []);

  const plans = useMemo(() => {
    if (!prefs) return [] as DayPlan[];
    return generateWeek(prefs.caloriasDiarias, prefs.gostaIds);
  }, [prefs]);

  const current = plans.find((d) => d.dia === tab);

  useEffect(() => {
    if (current) {
      setDayPlan(current as any);
      localStorage.setItem("planCurrentDay", tab);
      setOpenItem(undefined);
    }
  }, [current, tab]);

  const dayData = useMemo(() => {
    const d = (dayPlan || current);
    if (!d) return null as any;
    const items = d.refeicoes.flatMap((m) => m.itens);
    const totalProtein = Math.round(items.reduce((a, i) => a + (i["proteína_g"] || 0), 0));
    const totalCarb = Math.round(items.reduce((a, i) => a + (i["carboidrato_g"] || 0), 0));
    const totalFat = Math.round(items.reduce((a, i) => a + (i["gordura_g"] || 0), 0));
    const totalKcal = d.refeicoes.reduce((a, m) => a + (m.calorias || 0), 0);
    return { totalProtein, totalCarb, totalFat, totalKcal };
  }, [dayPlan, current]);

  useEffect(() => {
    const d = (dayPlan || current);
    if (!d) return;
    setTipsLoading(true);
    const desc = d.refeicoes
      .map((m) => `${m.nome}: ${m.itens.map((i) => `${i.nome} (${portionLabel(i)})`).join(", ")}`)
      .join(" | ");
    const prompt = `Com base nessas refeições do dia: ${desc}. Considere a rotina de alguém buscando praticidade e proteína animal. Dê 3-5 dicas de planejamento, substituições e ideias de pratos relacionados aos itens do dia.`;
    askGemini(prompt).then((t) => setTips(t)).finally(() => setTipsLoading(false));
  }, [dayPlan, current]);

  return (
    <div className="space-y-4">
      <Helmet>
        <title>Plano semanal | Plano alimentar rosa</title>
        <meta name="description" content="Seu plano alimentar semanal com foco em proteína animal e praticidade" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>


      <Tabs value={tab} onValueChange={(v) => { setTab(v); localStorage.setItem("planCurrentDay", v); setOpenItem(undefined); }} className="w-full">
        <TabsList className="grid grid-cols-7">
          {diasSemana.map((d) => (
            <TabsTrigger
              key={d}
              value={d}
              className="data-[state=active]:text-primary-foreground data-[state=active]:[background:var(--gradient-primary)] data-[state=active]:shadow-[var(--shadow-glow)] data-[state=active]:border-transparent"
            >
              {d}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {current && (
        <div className="space-y-3">
          {dayData && (
            <Card className="rounded-xl border bg-card shadow-[var(--shadow-elegant)] animate-fade-in">
              <CardHeader>
                <CardTitle>Resumo do dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid items-center gap-4 md:grid-cols-[180px_1fr]">
                  <div className="h-36 w-full animate-fade-in">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ name: "Proteínas", value: dayData.totalProtein }, { name: "Carboidratos", value: dayData.totalCarb }, { name: "Gorduras", value: dayData.totalFat }]} dataKey="value" nameKey="name" labelLine={false}>
                          <Cell fill="hsl(var(--primary))" />
                          <Cell fill="hsl(var(--secondary))" />
                          <Cell fill="hsl(var(--accent))" />
                          <LabelList dataKey="value" position="inside" fill="#ffffff" />
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-primary" /><span>Proteínas: {dayData.totalProtein} g</span></div>
                      <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-secondary" /><span>Carboidratos: {dayData.totalCarb} g</span></div>
                      <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-accent" /><span>Gorduras: {dayData.totalFat} g</span></div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium">Calorias totais:</span>
                      <JackpotNumber value={dayData.totalKcal} />
                      {prefs && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-xs">Meta</span>
                          <JackpotNumber value={prefs.caloriasDiarias} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Accordion type="single" collapsible value={openItem} onValueChange={(v) => {
            setOpenItem(v);
            if (v) setTimeout(() => itemRefs.current[v!]?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
          }} className="w-full space-y-3">
            {(dayPlan || current).refeicoes.map((meal, idx) => {
              const val = `item-${idx}`;
              return (
                <AccordionItem ref={(el) => (itemRefs.current[val] = el)} key={val} value={val} className="scroll-mt-24 rounded-xl border bg-card shadow-[var(--shadow-elegant)] animate-fade-in">
                  <AccordionTrigger className="px-4 py-3">
                    <div className="flex items-center gap-3 w-full">
                      <img src={meal.image} alt={`${meal.nome} foto ilustrativa`} className="h-10 w-14 object-cover rounded" loading="lazy" />
                      <div className="text-left">
                        <div className="font-medium">{meal.hora} — {meal.nome}</div>
                        <div className="text-xs text-muted-foreground">{meal.calorias} kcal</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">{meal.calorias} kcal</div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="secondary" className="hover-scale" aria-label="Perguntar IA" onClick={(e)=>{
                          e.stopPropagation();
                          const p = `me dê mais informações sobre ${meal.nome} com ${meal.itens.map(i=>`${i.nome} — ${portionLabel(i)}`).join(", ")}`;
                          setGeminiPrompt(p);
                          setGeminiOpen(true);
                        }}>
                          <Bot />
                        </Button>
                        <Dialog open={mealModalIdx === idx} onOpenChange={(o)=> { if (!o) { setMealModalIdx(null); setMealSuggestions([]); } }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={(e)=> {
                            e.stopPropagation();
                            if (!prefs || !current) return;
                            const alts: Meal[] = [];
                            const seen = new Set<string>();
                            const targetName = meal.nome;
                            let tries = 0;
                            while (alts.length < 3 && tries < 12) {
                              tries++;
                              const newDay = generateDay(prefs.caloriasDiarias, prefs.gostaIds, current.dia);
                              const mNew = newDay.refeicoes.find(r => r.nome === targetName);
                              if (!mNew) continue;
                              const sig = mNew.itens.map(i => i.id).join("|");
                              if (sig !== meal.itens.map(i => i.id).join("|") && !seen.has(sig)) {
                                seen.add(sig);
                                alts.push(mNew);
                              }
                            }
                            setMealSuggestions(alts);
                            setMealModalIdx(idx);
                          }}>Trocar refeição</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Trocar {meal.nome}</DialogTitle>
                            <DialogDescription>Escolha um prato completo equivalente (±10% kcal).</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2">
                            {mealSuggestions.map((mAlt, ai) => (
                              <button key={ai} className="text-left p-3 rounded-md border hover:bg-card focus:outline-none" onClick={() => {
                                setDayPlan(prev => {
                                  if (!prev) return prev;
                                  const newRef = prev.refeicoes.map((m, mi) => mi === idx ? mAlt : m);
                                  return { ...prev, refeicoes: newRef } as any;
                                });
                                setMealModalIdx(null);
                                setMealSuggestions([]);
                                toast("Refeição trocada");
                              }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <img src={mAlt.image} alt={`${mAlt.nome} sugestão`} className="h-10 w-14 object-cover rounded" />
                                  <div className="font-medium">{mAlt.hora} — {mAlt.nome}</div>
                                  <div className="ml-auto text-xs text-muted-foreground">{mAlt.calorias} kcal</div>
                                </div>
                                <ul className="text-xs list-disc pl-4">
                                  {mAlt.itens.map((i) => (
                                    <li key={i.id}>{i.nome} — {portionLabel(i)}</li>
                                  ))}
                                </ul>
                              </button>
                            ))}
                            {mealSuggestions.length === 0 && (
                              <div className="text-sm text-muted-foreground">Gerando sugestões...</div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="secondary" onClick={() => { setMealModalIdx(null); setMealSuggestions([]); }}>Cancelar</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    </div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {meal.itens.map((i) => (
                        <li key={i.id}>{i.nome} — {portionLabel(i)}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Dicas do dia (Gemini) */}
          <Card className="rounded-xl border bg-card shadow-[var(--shadow-elegant)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dicas de planejamento</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" asChild className="hover-scale" aria-label="Imprimir plano do dia">
                  <Link to={`/print?dia=${(dayPlan || current)?.dia || tab}`}>
                    <Printer />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tipsLoading ? (
                <div className="text-sm text-muted-foreground">Gerando dicas...</div>
              ) : (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{tips || ""}</div>
              )}
            </CardContent>
          </Card>

          {/* Janela de chat arredondada */}
          <Dialog open={geminiOpen} onOpenChange={setGeminiOpen}>
            <DialogContent className="rounded-xl p-0">
              <GeminiChat initialPrompt={geminiPrompt} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
