import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FOODS, FoodItem } from "@/data/foods";

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

const workStartByDay: Record<string, string> = { Seg: "08:00", Ter: "08:00", Qua: "08:00", Qui: "08:00", Sex: "08:00", Sáb: "00:00", Dom: "00:00" };
const COMMUTE_MIN = 30;
const gymStart = "06:40";
const gymEnd = "08:00";
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

function pick<T>(arr: T[], avoidIds: string[]): T | null {
  const options = arr.filter((i: any) => !avoidIds.includes((i as any).id));
  if (!options.length) return null;
  return options[Math.floor(Math.random() * options.length)];
}

function generateDay(calorias: number, gostaIds: string[], priorizarFrango: boolean): DayPlan {
  const liked = FOODS.filter((f) => gostaIds.includes(f.id));
  const affordable = FOODS.filter((f) => f.affordable_flag);
  const pool = liked.length >= 6 ? liked : affordable;

  const choose = (categoria: FoodItem["categoria"], preferId?: string) => {
    const base = pool.filter((f) => f.categoria === categoria);
    if (preferId) {
      const first = base.find((b) => b.id === preferId) || base[0];
      return first;
    }
    return pick(base, []) || base[0];
  };

  const total = calorias;
  const meals: Meal[] = [];

  // Café
  meals.push({
    nome: "Café",
    itens: [choose("Carboidratos"), choose("Frutas"), choose("Laticínios")].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Café"]),
    image: chickenImg,
  });
  // Colação
  meals.push({
    nome: "Colação",
    itens: [choose("Snacks"), choose("Frutas")].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Colação"]),
    image: chickenImg,
  });
  // Almoço
  meals.push({
    nome: "Almoço",
    itens: [
      choose("Proteínas (Animais)", priorizarFrango ? "proteina_frango" : undefined),
      choose("Carboidratos"),
      choose("Leguminosas"),
      choose("Legumes & Verduras"),
    ].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Almoço"]),
    image: chickenImg,
  });
  // Lanche
  meals.push({
    nome: "Lanche",
    itens: [choose("Carboidratos", "carb_aveia"), choose("Frutas", "fruta_banana")].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Lanche"]),
    image: chickenImg,
  });
  // Jantar
  meals.push({
    nome: "Jantar",
    itens: [
      choose("Proteínas (Animais)", priorizarFrango ? "proteina_frango" : undefined),
      choose("Carboidratos"),
      choose("Legumes & Verduras"),
    ].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Jantar"]),
    image: chickenImg,
  });
  // Ceia
  meals.push({
    nome: "Ceia",
    itens: [choose("Snacks")].filter(Boolean) as FoodItem[],
    calorias: Math.round(total * dist["Ceia"]),
    image: chickenImg,
  });

  return { dia: "Seg", refeicoes: meals, totalKcal: total };
}

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export default function Plan() {
const [prefs, setPrefs] = useState<{ caloriasDiarias: number; gostaIds: string[] } | null>(null);
const [tab, setTab] = useState<string>("Seg");

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
  return diasSemana.map((dia) => (
    generateDay(prefs.caloriasDiarias, prefs.gostaIds, dia)
  ));
}, [prefs]);

  const current = plans.find((d) => d.dia === tab);

  return (
    <div className="space-y-4">
      <Helmet>
        <title>Plano semanal | Plano alimentar rosa</title>
        <meta name="description" content="Seu plano alimentar semanal com foco em proteína animal e praticidade" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seu plano</h1>
        <div className="flex items-center gap-2">
          <Link to={`/print?dia=${tab}`}><Button variant="outline">Imprimir</Button></Link>
          <Link to="/onboarding"><Button variant="subtle">Editar preferências</Button></Link>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-7">
          {diasSemana.map((d) => (
            <TabsTrigger key={d} value={d}>{d}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {current && (
        <div className="space-y-3">
          {current.refeicoes.map((meal, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardContent className="p-0">
                <Accordion type="single" collapsible defaultValue="item-0">
                  <AccordionItem value={`item-${idx}`}>
                    <AccordionTrigger className="px-4 py-3">
<div className="flex items-center gap-3">
  <img src={meal.image} alt={`${meal.nome} foto ilustrativa`} className="h-10 w-14 object-cover rounded" loading="lazy" />
  <div className="text-left">
    <div className="font-medium">{meal.hora} — {meal.nome}</div>
    <div className="text-xs text-muted-foreground">{meal.calorias} kcal</div>
  </div>
</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {meal.itens.map((i) => (
                          <li key={i.id}>{i.nome} — {i.typical_portion_g} g</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">Substituições</Button>
                        <Button size="sm" variant="ghost">Perguntar ao Gemini</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
