import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FOODS, FoodItem } from "@/data/foods";
import { generateWeek, portionLabel } from "@/lib/plan/generator";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
            <TabsTrigger key={d} value={d}>{d}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {current && (
        <div className="space-y-3">
          <Accordion type="single" collapsible value={openItem} onValueChange={(v) => {
            setOpenItem(v);
            if (v) setTimeout(() => itemRefs.current[v!]?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
          }} className="w-full">
            {(dayPlan || current).refeicoes.map((meal, idx) => {
              const val = `item-${idx}`;
              return (
                <AccordionItem ref={(el) => (itemRefs.current[val] = el)} key={val} value={val} className="scroll-mt-24 border rounded-md bg-card/30">
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
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {meal.itens.map((i, itx) => (
                        <li key={i.id} className="space-y-1">
                          <div>{i.nome} — {portionLabel(i)}</div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                            <span>Substituir por:</span>
                            {FOODS.filter(f => f.categoria === i.categoria && f.id !== i.id).slice(0,3).map(alt => (
                              <button
                                key={alt.id}
                                className="px-2 py-0.5 rounded border bg-background hover:bg-card transition"
                                onClick={() => {
                                  setDayPlan(prev => {
                                    if (!prev) return prev;
                                    const clone = { ...prev, refeicoes: prev.refeicoes.map((m, mi) => mi === idx ? { ...m, itens: m.itens.map((it, ii) => (ii === itx ? alt : it)) } : m) };
                                    return clone as any;
                                  });
                                }}
                              >{alt.nome}</button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
