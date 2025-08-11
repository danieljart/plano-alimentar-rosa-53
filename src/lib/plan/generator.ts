import { FOODS, FoodItem } from "@/data/foods";

export type Meal = {
  nome: string;
  itens: FoodItem[];
  calorias: number;
  image: string;
  hora: string;
};

export type DayPlan = { dia: string; refeicoes: Meal[]; totalKcal: number; mainProteinId?: string };

export const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

const dist: Record<string, number> = {
  "Café": 0.2,
  "Colação": 0.1,
  "Almoço": 0.3,
  "Lanche": 0.1,
  "Jantar": 0.25,
  "Ceia": 0.05,
};

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const toHHMM = (m: number) => { const h = Math.floor(m / 60); const mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };

function pick<T>(arr: T[]): T | null { if (!arr.length) return null; return arr[Math.floor(Math.random() * arr.length)]; }

function byCat(pool: FoodItem[], categoria: FoodItem["categoria"]) { return pool.filter(f => f.categoria === categoria); }

function poolFromPrefs(gostaIds: string[]) {
  const liked = FOODS.filter(f => gostaIds.includes(f.id));
  const affordable = FOODS.filter(f => f.affordable_flag);
  return liked.length >= 6 ? liked : Array.from(new Set([...liked, ...affordable]));
}

// Helpers to constrain choices by meal
const isBreakfastCarb = (f: FoodItem) => f.id === "carb_pao_integral" || f.id === "carb_tapioca" || f.id === "carb_aveia" || f.id === "carb_cuscuz";
const isLunchCarb = (f: FoodItem) => ["carb_arroz_integral", "carb_macarrao_integral", "carb_batata_doce", "carb_mandioca", "carb_quinoa", "carb_farofa"].includes(f.id);
const lightCarbDinner = (f: FoodItem) => ["carb_batata_doce", "carb_mandioca", "carb_quinoa", "carb_arroz_integral"].includes(f.id);
const beverageBreakfast = (f: FoodItem) => f.categoria === "Bebidas" && ["bebida_cafe", "bebida_suco_natural", "bebida_cha"].includes(f.id);

export function portionLabel(item: FoodItem): string {
  // Units by ID/category (frontend mapping)
  if (item.id === "proteina_ovos" || item.id === "snack_ovos_cozidos") return "2 unid";
  if (item.categoria === "Frutas") return "1 unid";
  if (item.id === "carb_pao_integral") return "2 fatias";
  if (item.id === "lat_queijo_minas" || item.id === "lat_queijo_fresco") return "1 fatia";
  if (item.id === "snack_torradas_integral") return "3 unid";
  if (item.categoria === "Bebidas") return `${item.typical_portion_g} ml`;
  // Default grams
  return `${item.typical_portion_g} g`;
}

function chooseProtein(pool: FoodItem[], avoidId?: string) {
  const proteins = byCat(pool, "Proteínas (Animais)").filter(p => p.id !== avoidId);
  return pick(proteins) || byCat(pool, "Proteínas (Animais)")[0];
}

function chooseMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function generateDay(total: number, gostaIds: string[], dia: string, avoidProteinId?: string): DayPlan {
  const pool = poolFromPrefs(gostaIds);

  // Base times
  const times: Record<string, string> = {
    "Colação": "06:10",
    "Café": "08:20",
    "Almoço": "12:30",
    "Lanche": "15:30",
    "Jantar": "19:30",
    "Ceia": "21:30",
  };

  // Breakfast
  const breakfastCarbs = byCat(pool, "Carboidratos").filter(isBreakfastCarb);
  const breakfastBeverages = FOODS.filter(beverageBreakfast);
  const cafeItens = [
    pick(breakfastCarbs),
    pick(byCat(pool, "Frutas")),
    pick(breakfastBeverages),
  ].filter(Boolean) as FoodItem[];

  // Colação (leve): fruta + iogurte OU fruta + torrada
  const fruit = pick(byCat(pool, "Frutas"));
  const yogurt = byCat(pool, "Laticínios").find(i => i.id === "lat_iogurte") || pick(byCat(pool, "Laticínios"));
  const toast = FOODS.find(i => i.id === "snack_torradas_integral");
  const colacaoItens = [fruit, (Math.random() < 0.5 ? yogurt : toast)].filter(Boolean) as FoodItem[];

  // Almoço
  const protAlmoco = chooseProtein(pool, avoidProteinId);
  const carbAlmoco = pick(byCat(pool, "Carboidratos").filter(isLunchCarb));
  const salada = chooseMany(byCat(pool, "Legumes & Verduras"), 2);
  const almocoItens = [protAlmoco, carbAlmoco, ...salada].filter(Boolean) as FoodItem[];

  // Lanche: iogurte + fruta OU aveia + fruta
  const aveia = FOODS.find(i => i.id === "carb_aveia");
  const lancheItens = [Math.random() < 0.5 ? (yogurt || aveia) : aveia, fruit || pick(byCat(pool, "Frutas"))].filter(Boolean) as FoodItem[];

  // Jantar (carb mais leve)
  const protJantar = protAlmoco; // manter mesma proteína no dia
  const carbJantar = pick(byCat(pool, "Carboidratos").filter(lightCarbDinner));
  const saladaJ = chooseMany(byCat(pool, "Legumes & Verduras"), 2);
  const jantarItens = [protJantar, carbJantar, ...saladaJ].filter(Boolean) as FoodItem[];

  // Ceia: iogurte OU fruta OU chá
  const ceiaChoice = pick([yogurt, fruit, FOODS.find(i => i.id === "bebida_cha")].filter(Boolean) as FoodItem[]);
  const ceiaItens = [ceiaChoice!];

  const meals: Meal[] = [
    { nome: "Café", itens: cafeItens, calorias: Math.round(total * dist["Café"]), image: cafeItens[0]?.image_url || "", hora: times["Café"] },
    { nome: "Colação", itens: colacaoItens.slice(0, 2), calorias: Math.round(total * dist["Colação"]), image: (colacaoItens[0] || fruit)?.image_url || "", hora: times["Colação"] },
    { nome: "Almoço", itens: almocoItens, calorias: Math.round(total * dist["Almoço"]), image: almocoItens[0]?.image_url || "", hora: times["Almoço"] },
    { nome: "Lanche", itens: lancheItens.slice(0, 2), calorias: Math.round(total * dist["Lanche"]), image: (lancheItens[0] || fruit)?.image_url || "", hora: times["Lanche"] },
    { nome: "Jantar", itens: jantarItens, calorias: Math.round(total * dist["Jantar"]), image: jantarItens[0]?.image_url || "", hora: times["Jantar"] },
    { nome: "Ceia", itens: ceiaItens, calorias: Math.round(total * dist["Ceia"]), image: ceiaItens[0]?.image_url || "", hora: times["Ceia"] },
  ];

  // Sort by time
  meals.sort((a, b) => toMin(a.hora) - toMin(b.hora));
  return { dia, refeicoes: meals, totalKcal: total, mainProteinId: protAlmoco?.id };
}

export function generateWeek(total: number, gostaIds: string[]): DayPlan[] {
  let lastProtein: string | undefined = undefined;
  return diasSemana.map(dia => {
    const day = generateDay(total, gostaIds, dia, lastProtein);
    lastProtein = day.mainProteinId || lastProtein;
    return day;
  });
}
