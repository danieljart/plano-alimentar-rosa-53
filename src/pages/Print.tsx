import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { FOODS, FoodItem } from "@/data/foods";
import { Button } from "@/components/ui/button";

function getPrefs() {
  const p = localStorage.getItem("onboardingPrefs");
  return p ? JSON.parse(p) : null;
}

type Meal = { nome: string; itens: FoodItem[]; calorias: number; image: string; hora: string };

type DayPlan = { dia: string; refeicoes: Meal[]; totalKcal: number };

const dist = { "Café": 0.2, "Colação": 0.1, "Almoço": 0.3, "Lanche": 0.1, "Jantar": 0.25, "Ceia": 0.05 } as const;

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }

function genDay(cal: number, gosta: string[], dia: string): DayPlan {
  const pool = FOODS.filter((f) => gosta.includes(f.id))
    .concat(FOODS.filter((f) => f.affordable_flag));
  const by = (cat: FoodItem["categoria"]) => pool.filter((f) => f.categoria === cat);
  const prot = by("Proteínas (Animais)");
  const carb = by("Carboidratos");
  const legu = by("Leguminosas");
  const vegs = by("Legumes & Verduras");
  const snack = by("Snacks");
  const frutas = by("Frutas");
  const lact = by("Laticínios");
  const frango = prot.find((p) => p.id === "proteina_frango") || pick(prot);
  const p1 = frango || pick(prot);
  const p2 = frango || pick(prot);

  const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60+m; };
  const toHHMM = (m: number) => { const h=Math.floor(m/60), mm=m%60; return `${String(h).padStart(2,"0")}:${String(mm).padStart(2,"0")}`; };
  const workStartByDay: Record<string,string> = { Seg:"08:00", Ter:"08:00", Qua:"08:00", Qui:"08:00", Sex:"08:00", Sáb:"00:00", Dom:"00:00" };
  const COMMUTE_MIN = 30;
  const times: Record<string,string> = { "Colação":"06:10", "Café":"08:20", "Almoço":"12:30", "Lanche":"15:30", "Jantar":"19:30", "Ceia":"21:30" };
  const workStart = workStartByDay[dia] || "08:00";
  if (toMin(workStart) >= toMin("12:00")) {
    const endLimit = toMin("11:59") - COMMUTE_MIN; const start = endLimit - 45; times["Almoço"] = toHHMM(Math.max(start, toMin("10:30")));
  }

  const meals: Meal[] = [
    { nome: "Café", itens: [pick(carb), pick(frutas), pick(lact)], calorias: Math.round(cal*dist["Café"]), image: by("Carboidratos")[0]?.image_url || "", hora: times["Café"] },
    { nome: "Colação", itens: [pick(snack), pick(frutas)], calorias: Math.round(cal*dist["Colação"]), image: pick(snack).image_url, hora: times["Colação"] },
    { nome: "Almoço", itens: [p1, pick(carb), pick(legu), pick(vegs)], calorias: Math.round(cal*dist["Almoço"]), image: p1.image_url, hora: times["Almoço"] },
    { nome: "Lanche", itens: [pick(carb), pick(frutas)], calorias: Math.round(cal*dist["Lanche"]), image: pick(carb).image_url, hora: times["Lanche"] },
    { nome: "Jantar", itens: [p2, pick(carb), pick(vegs)], calorias: Math.round(cal*dist["Jantar"]), image: p2.image_url, hora: times["Jantar"] },
    { nome: "Ceia", itens: [pick(snack)], calorias: Math.round(cal*dist["Ceia"]), image: pick(snack).image_url, hora: times["Ceia"] },
  ].filter(Boolean) as Meal[];

  meals.sort((a,b)=>toMin(a.hora)-toMin(b.hora));
  return { dia: "Dia", refeicoes: meals, totalKcal: cal };
}

export default function PrintPage() {
  const [sp] = useSearchParams();
  const [prefs, setPrefs] = useState<any>(null);
  const dia = sp.get("dia") || "Seg";

  useEffect(() => { setPrefs(getPrefs()); }, []);

const plan: DayPlan | null = useMemo(() => {
  if (!prefs) return null;
  return genDay(prefs.caloriasDiarias, prefs.gostaIds, dia);
}, [prefs, dia]);

  const userName = localStorage.getItem("authEmail")?.split("@")[0] || "Usuária";

  return (
    <div className="p-4">
      <Helmet>
        <title>Impressão | Plano alimentar</title>
        <meta name="description" content="Versão imprimível do seu plano em A4 landscape" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <style>{`@media print { @page { size: A4 landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>

      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Plano do dia — {dia}</h1>
        <Button variant="hero" onClick={() => window.print()}>Exportar PDF</Button>
      </div>

      {plan && (
        <div className="grid grid-cols-3 gap-3 print:grid-cols-3">
          <div className="col-span-3 flex justify-between text-sm">
            <div><strong>Nome:</strong> {userName}</div>
            <div><strong>Data:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Total do dia:</strong> {plan.totalKcal} kcal</div>
          </div>
          {plan.refeicoes.map((m, i) => (
            <section key={i} className="border rounded-md p-2">
<header className="flex items-center gap-2 mb-1">
  <img src={m.image} alt={`${m.nome}`} className="h-10 w-14 object-cover rounded" />
  <div className="text-sm font-semibold">{m.hora} — {m.nome}</div>
  <div className="ml-auto text-xs text-muted-foreground">{m.calorias} kcal</div>
</header>
              <ul className="text-xs list-disc pl-4">
                {m.itens.map((i) => (
                  <li key={i.id}>{i.nome} — {i.typical_portion_g} g</li>
                ))}
              </ul>
              <div className="mt-1 text-[11px] text-muted-foreground">Substituições: ver app (±10% kcal)</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
