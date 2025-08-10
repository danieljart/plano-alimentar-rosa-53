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

function generateDay(calorias: number, gostaIds: string[], dia: string): DayPlan {
  const liked = FOODS.filter((f) => gostaIds.includes(f.id));
  const affordable = FOODS.filter((f) => f.affordable_flag);
  const pool = liked.length >= 6 ? liked : affordable;

  const by = (categoria: FoodItem["categoria"]) => pool.filter((f) => f.categoria === categoria);

  const choose = (categoria: FoodItem["categoria"], preferId?: string) => {
    const base = by(categoria);
    if (!base.length) return null;
    if (preferId) {
      const first = base.find((b) => b.id === preferId) || base[0];
      return first;
    }
    return (pick(base, []) as FoodItem) || base[0];
  };

  // Times base e ajuste por deslocamento
  const times: Record<string, string> = {
    "Colação": "06:10", // pré-treino, termina antes de 06:40
    "Café": "08:20",    // pós-treino (ajustaremos abaixo conforme deslocamento)
    "Almoço": "12:30",
    "Lanche": "15:30",
    "Jantar": "19:30",
    "Ceia": "21:30",
  };

  // Rotas do dia: Seg/Ter = academia -> trabalho; Qua–Sáb = casa -> trabalho; Dom = sem rota
  const route: "gym-to-work" | "home-to-work" | "none" =
    dia === "Seg" || dia === "Ter" ? "gym-to-work" :
    dia === "Qua" || dia === "Qui" || dia === "Sex" || dia === "Sáb" ? "home-to-work" : "none";

  // Tempos a pé (padrão seguro)
  const commuteToWorkMin = route === "gym-to-work" ? 12 : route === "home-to-work" ? 20 : 0;

  const workStart = workStartByDay[dia] || "08:00";

  // Ajuste do Café conforme deslocamento
  if (route === "gym-to-work") {
    const arrival = toMin(gymEnd) + commuteToWorkMin; // saída 08:00 + 12min => chegada ~08:12
    times["Café"] = toHHMM(arrival + 5); // 5min para chegar/organizar
  } else if (route === "home-to-work" && toMin(workStart) > 0) {
    const departure = toMin(workStart) - commuteToWorkMin; // horário de sair de casa
    times["Café"] = toHHMM(Math.max(toMin("06:10"), departure - 20)); // terminar 20min antes de sair
  }

  // Regra de almoço antes de 12h quando aplicável, considerando deslocamento do dia
  if (toMin(workStart) >= toMin("12:00")) {
    const endLimit = toMin("11:59") - commuteToWorkMin;
    const start = endLimit - 45; // 45 min para almoço
    const minStart = toMin("10:30");
    times["Almoço"] = toHHMM(Math.max(start, minStart));
  }

  const total = calorias;
  const meals: Meal[] = [];

  // Build items per meal
  const cafeItens = [choose("Carboidratos"), choose("Frutas"), choose("Laticínios")].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Café",
    itens: cafeItens,
    calorias: Math.round(total * dist["Café"]),
    image: cafeItens[0]?.image_url || by("Carboidratos")[0]?.image_url || "",
    hora: times["Café"],
  });

  const colacaoItens = [choose("Snacks"), choose("Frutas")].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Colação",
    itens: colacaoItens,
    calorias: Math.round(total * dist["Colação"]),
    image: colacaoItens[0]?.image_url || by("Snacks")[0]?.image_url || "",
    hora: times["Colação"],
  });

  // Prefer chicken if available to keep proteins animal-centric
  const proteins = by("Proteínas (Animais)");
  const frango = proteins.find((p) => p.id === "proteina_frango") || proteins[0];

  const almocoItens = [
    frango || choose("Proteínas (Animais)"),
    choose("Carboidratos"),
    choose("Leguminosas"),
    choose("Legumes & Verduras"),
  ].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Almoço",
    itens: almocoItens,
    calorias: Math.round(total * dist["Almoço"]),
    image: almocoItens[0]?.image_url || frango?.image_url || "",
    hora: times["Almoço"],
  });

  const lancheItens = [choose("Carboidratos", "carb_aveia"), choose("Frutas", "fruta_banana")].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Lanche",
    itens: lancheItens,
    calorias: Math.round(total * dist["Lanche"]),
    image: lancheItens[0]?.image_url || by("Carboidratos")[0]?.image_url || "",
    hora: times["Lanche"],
  });

  const jantarItens = [
    frango || choose("Proteínas (Animais)"),
    choose("Carboidratos"),
    choose("Legumes & Verduras"),
  ].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Jantar",
    itens: jantarItens,
    calorias: Math.round(total * dist["Jantar"]),
    image: jantarItens[0]?.image_url || frango?.image_url || "",
    hora: times["Jantar"],
  });

  const ceiaItens = [choose("Snacks")].filter(Boolean) as FoodItem[];
  meals.push({
    nome: "Ceia",
    itens: ceiaItens,
    calorias: Math.round(total * dist["Ceia"]),
    image: ceiaItens[0]?.image_url || by("Snacks")[0]?.image_url || "",
    hora: times["Ceia"],
  });

  // Sort by time ascending
  meals.sort((a, b) => toMin(a.hora) - toMin(b.hora));

  return { dia, refeicoes: meals, totalKcal: total };
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
