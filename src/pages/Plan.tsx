import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeminiChat from "@/components/GeminiChat";
import JackpotNumber from "@/components/JackpotNumber";
import { askGemini } from "@/lib/gemini";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Bot, Printer, RefreshCw } from "lucide-react";
import { useMealPlan, type DayPlan, type Meal } from "@/hooks/useMealPlan";

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export default function Plan() {
  const [prefs, setPrefs] = useState<{ caloriasDiarias: number; gostaIds: string[] } | null>(null);
  const [tab, setTab] = useState<string>(() => localStorage.getItem("planCurrentDay") || "Seg");
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [tips, setTips] = useState<string>("");
  const [tipsLoading, setTipsLoading] = useState(false);
  
  const { plan, loading: planLoading, generatePlan } = useMealPlan();

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

  // Generate plan if none exists and preferences are loaded
  useEffect(() => {
    if (prefs && !plan && !planLoading) {
      generatePlan(prefs.caloriasDiarias, prefs.gostaIds).catch(console.error);
    }
  }, [prefs, plan, planLoading, generatePlan]);

  const currentDay = plan?.days.find(d => diasSemana[d.day_index] === tab);

  const dayData = useMemo(() => {
    if (!currentDay) return null;
    
    const totalProtein = Math.round(
      currentDay.meals.flatMap(m => m.items).reduce((a, i) => a + i.protein_g, 0)
    );
    const totalCarb = Math.round(
      currentDay.meals.flatMap(m => m.items).reduce((a, i) => a + i.carbs_g, 0)
    );
    const totalFat = Math.round(
      currentDay.meals.flatMap(m => m.items).reduce((a, i) => a + i.fat_g, 0)
    );
    const totalKcal = currentDay.total_kcal;
    
    return { totalProtein, totalCarb, totalFat, totalKcal };
  }, [currentDay]);

  useEffect(() => {
    if (!currentDay) return;
    setTipsLoading(true);
    const desc = currentDay.meals
      .map((m) => `${m.name}: ${m.items.map((i) => `${i.food_name} (${i.unit})`).join(", ")}`)
      .join(" | ");
    const prompt = `Com base nessas refeições do dia: ${desc}. Considere a rotina de alguém buscando praticidade e proteína animal. Dê 3-5 dicas de planejamento, substituições e ideias de pratos relacionados aos itens do dia.`;
    askGemini(prompt).then((t) => setTips(t)).finally(() => setTipsLoading(false));
  }, [currentDay]);

  const handleRegeneratePlan = async () => {
    if (!prefs) return;
    
    try {
      await generatePlan(prefs.caloriasDiarias, prefs.gostaIds);
      toast("Plano regenerado com sucesso!");
    } catch (error) {
      toast("Erro ao regenerar plano. Tente novamente.");
    }
  };

  return (
    <div className="space-y-4">
      <Helmet>
        <title>Plano semanal | Plano alimentar rosa</title>
        <meta name="description" content="Seu plano alimentar semanal com foco em proteína animal e praticidade" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {planLoading && (
        <Card className="rounded-xl border bg-card shadow-[var(--shadow-elegant)]">
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Gerando seu plano personalizado com Gemini...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!planLoading && plan && (
        <>
          <div className="flex items-center justify-between">
            <Tabs value={tab} onValueChange={(v) => { setTab(v); localStorage.setItem("planCurrentDay", v); setOpenItem(undefined); }} className="flex-1">
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegeneratePlan}
              className="ml-4"
              disabled={planLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Novo plano
            </Button>
          </div>

          {currentDay && (
            <div className="space-y-3">
              {dayData && (
                <Card className="rounded-xl border bg-card shadow-[var(--shadow-elegant)] animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl">Resumo do dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-3 md:grid-cols-[160px_1fr]">
                      <div className="h-28 md:h-32 w-full animate-fade-in">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Proteínas", value: dayData.totalProtein },
                                { name: "Carboidratos", value: dayData.totalCarb },
                                { name: "Gorduras", value: dayData.totalFat },
                              ]}
                              dataKey="value"
                              nameKey="name"
                              labelLine={false}
                            >
                              <Cell fill="hsl(var(--chart-protein))" />
                              <Cell fill="hsl(var(--chart-carb))" />
                              <Cell fill="hsl(var(--chart-fat))" />
                            </Pie>
                            <ReTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="animate-fade-in">
                        <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                          <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-chart-protein" /><span>Proteínas: {dayData.totalProtein} g</span></div>
                          <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-chart-carb" /><span>Carbo: {dayData.totalCarb} g</span></div>
                          <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-chart-fat" /><span>Gorduras: {dayData.totalFat} g</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">Calorias totais</span>
                        <JackpotNumber value={dayData.totalKcal} />
                      </div>
                      {prefs && (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Meta calórica</span>
                          <JackpotNumber value={prefs.caloriasDiarias} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Accordion type="single" collapsible value={openItem} onValueChange={(v) => {
                setOpenItem(v);
              }} className="w-full space-y-3">
                {currentDay.meals.map((meal, idx) => {
                  const val = `item-${idx}`;
                  return (
                    <AccordionItem key={val} value={val} className="scroll-mt-24 rounded-xl border bg-card shadow-[var(--shadow-elegant)] animate-fade-in">
                      <AccordionTrigger className="px-4 py-3">
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-10 w-14 bg-muted rounded flex items-center justify-center text-xs font-medium">
                            {meal.name[0]}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{meal.time} — {meal.name}</div>
                            <div className="text-xs text-muted-foreground">{meal.calories} kcal</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-muted-foreground">{meal.calories} kcal</div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="secondary" className="hover-scale" aria-label="Perguntar IA" onClick={(e)=>{
                              e.stopPropagation();
                              const p = `me dê mais informações sobre ${meal.name} com ${meal.items.map(i=>`${i.food_name} — ${i.unit}`).join(", ")}`;
                              setGeminiPrompt(p);
                              setGeminiOpen(true);
                            }}>
                              <Bot />
                            </Button>
                          </div>
                        </div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {meal.items.map((item) => (
                            <li key={item.food_id}>{item.food_name} — {item.unit}</li>
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
                      <Link to={`/print?dia=${currentDay.day_name}`}>
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
        </>
      )}
    </div>
  );
}
