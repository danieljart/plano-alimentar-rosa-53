export type PriceLabel = "econômico" | "médio" | "caro";

export interface FoodItem {
  id: string;
  categoria:
    | "Proteínas (Animais)"
    | "Carboidratos"
    | "Legumes & Verduras"
    | "Leguminosas"
    | "Frutas"
    | "Gorduras & Complementos"
    | "Laticínios"
    | "Snacks"
    | "Bebidas";
  nome: string;
  calorias_por_porção: number; // kcal por porção típica
  proteína_g: number;
  carboidrato_g: number;
  gordura_g: number;
  typical_portion_g: number; // gramas por porção típica
  image_url: string;
  alt: string;
  price_label: PriceLabel;
  affordable_flag: boolean;
  lactose?: boolean;
  glúten?: boolean;
}

import chickenImg from "@/assets/food-chicken.jpg";
import riceBeansImg from "@/assets/food-rice-beans.jpg";
import oatBananaImg from "@/assets/food-oat-banana.jpg";
import saladImg from "@/assets/food-salad.jpg";

export const FOODS: FoodItem[] = [
  // Proteínas (Animais)
  {
    id: "proteina_frango",
    categoria: "Proteínas (Animais)",
    nome: "Aves (frango)",
    calorias_por_porção: 165,
    proteína_g: 31,
    carboidrato_g: 0,
    gordura_g: 3.6,
    typical_portion_g: 100,
    image_url: chickenImg,
    alt: "Peito de frango grelhado com brócolis",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "proteina_bovina",
    categoria: "Proteínas (Animais)",
    nome: "Carne (bovina)",
    calorias_por_porção: 217,
    proteína_g: 26,
    carboidrato_g: 0,
    gordura_g: 12,
    typical_portion_g: 100,
    image_url: chickenImg,
    alt: "Carne bovina grelhada",
    price_label: "médio",
    affordable_flag: false,
  },
  {
    id: "proteina_porco",
    categoria: "Proteínas (Animais)",
    nome: "Porco",
    calorias_por_porção: 242,
    proteína_g: 27,
    carboidrato_g: 0,
    gordura_g: 14,
    typical_portion_g: 100,
    image_url: chickenImg,
    alt: "Carne suína grelhada",
    price_label: "médio",
    affordable_flag: false,
  },
  {
    id: "proteina_tilapia",
    categoria: "Proteínas (Animais)",
    nome: "Peixe (tilápia)",
    calorias_por_porção: 129,
    proteína_g: 26,
    carboidrato_g: 0,
    gordura_g: 2.7,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Filé de tilápia grelhado",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "proteina_salmao",
    categoria: "Proteínas (Animais)",
    nome: "Peixe (salmão)",
    calorias_por_porção: 208,
    proteína_g: 20,
    carboidrato_g: 0,
    gordura_g: 13,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Filé de salmão assado",
    price_label: "caro",
    affordable_flag: false,
  },
  {
    id: "proteina_ovos",
    categoria: "Proteínas (Animais)",
    nome: "Ovos (cozido/mexido/omelete)",
    calorias_por_porção: 155,
    proteína_g: 13,
    carboidrato_g: 1.1,
    gordura_g: 11,
    typical_portion_g: 100,
    image_url: chickenImg,
    alt: "Ovos cozidos",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "proteina_sardinha",
    categoria: "Proteínas (Animais)",
    nome: "Peixe (sardinha)",
    calorias_por_porção: 208,
    proteína_g: 25,
    carboidrato_g: 0,
    gordura_g: 11.5,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Sardinha grelhada",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "proteina_figado",
    categoria: "Proteínas (Animais)",
    nome: "Miúdos (fígado)",
    calorias_por_porção: 165,
    proteína_g: 26,
    carboidrato_g: 3.9,
    gordura_g: 4.8,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Fígado acebolado",
    price_label: "econômico",
    affordable_flag: true,
  },

  // Carboidratos
  {
    id: "carb_arroz_integral",
    categoria: "Carboidratos",
    nome: "Arroz integral",
    calorias_por_porção: 111,
    proteína_g: 2.6,
    carboidrato_g: 23,
    gordura_g: 0.9,
    typical_portion_g: 100,
    image_url: riceBeansImg,
    alt: "Arroz integral",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "carb_arroz_branco",
    categoria: "Carboidratos",
    nome: "Arroz branco",
    calorias_por_porção: 130,
    proteína_g: 2.4,
    carboidrato_g: 28,
    gordura_g: 0.3,
    typical_portion_g: 100,
    image_url: riceBeansImg,
    alt: "Arroz branco",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "carb_macarrao_integral",
    categoria: "Carboidratos",
    nome: "Macarrão integral",
    calorias_por_porção: 124,
    proteína_g: 5,
    carboidrato_g: 27,
    gordura_g: 0.9,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Macarrão integral",
    price_label: "médio",
    affordable_flag: true,
  },
  {
    id: "carb_batata_doce",
    categoria: "Carboidratos",
    nome: "Batata doce",
    calorias_por_porção: 86,
    proteína_g: 1.6,
    carboidrato_g: 20,
    gordura_g: 0.1,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Batata doce cozida",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "carb_cuscuz",
    categoria: "Carboidratos",
    nome: "Cuscuz (milho)",
    calorias_por_porção: 112,
    proteína_g: 3.8,
    carboidrato_g: 23,
    gordura_g: 0.6,
    typical_portion_g: 100,
    image_url: oatBananaImg,
    alt: "Cuscuz de milho",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "carb_pao_integral",
    categoria: "Carboidratos",
    nome: "Pão integral",
    calorias_por_porção: 247,
    proteína_g: 13,
    carboidrato_g: 41,
    gordura_g: 4.2,
    typical_portion_g: 100,
    image_url: oatBananaImg,
    alt: "Pão integral",
    price_label: "médio",
    affordable_flag: true,
  },
  {
    id: "carb_aveia",
    categoria: "Carboidratos",
    nome: "Aveia",
    calorias_por_porção: 389,
    proteína_g: 17,
    carboidrato_g: 66,
    gordura_g: 7,
    typical_portion_g: 100,
    image_url: oatBananaImg,
    alt: "Aveia em flocos",
    price_label: "econômico",
    affordable_flag: true,
  },

  // Leguminosas
  {
    id: "legum_feijao",
    categoria: "Leguminosas",
    nome: "Feijão",
    calorias_por_porção: 127,
    proteína_g: 9,
    carboidrato_g: 23,
    gordura_g: 0.5,
    typical_portion_g: 100,
    image_url: riceBeansImg,
    alt: "Feijão cozido",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "legum_lentilha",
    categoria: "Leguminosas",
    nome: "Lentilha",
    calorias_por_porção: 116,
    proteína_g: 9,
    carboidrato_g: 20,
    gordura_g: 0.4,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Lentilhas cozidas",
    price_label: "econômico",
    affordable_flag: true,
  },

  // Legumes & Verduras (alguns)
  { id: "veg_brocolis", categoria: "Legumes & Verduras", nome: "Brócolis", calorias_por_porção: 35, proteína_g: 2.4, carboidrato_g: 7, gordura_g: 0.4, typical_portion_g: 100, image_url: saladImg, alt: "Brócolis cozido", price_label: "econômico", affordable_flag: true },
  { id: "veg_cenoura", categoria: "Legumes & Verduras", nome: "Cenoura", calorias_por_porção: 41, proteína_g: 0.9, carboidrato_g: 10, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Cenoura fatiada", price_label: "econômico", affordable_flag: true },
  { id: "veg_alface", categoria: "Legumes & Verduras", nome: "Alface", calorias_por_porção: 15, proteína_g: 1.4, carboidrato_g: 2.9, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Folhas de alface", price_label: "econômico", affordable_flag: true },
  { id: "veg_tomate", categoria: "Legumes & Verduras", nome: "Tomate", calorias_por_porção: 18, proteína_g: 0.9, carboidrato_g: 3.9, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Tomate fresco", price_label: "econômico", affordable_flag: true },

  // Frutas (algumas)
  { id: "fruta_banana", categoria: "Frutas", nome: "Banana", calorias_por_porção: 89, proteína_g: 1.1, carboidrato_g: 23, gordura_g: 0.3, typical_portion_g: 100, image_url: oatBananaImg, alt: "Banana fatiada", price_label: "econômico", affordable_flag: true },
  { id: "fruta_maca", categoria: "Frutas", nome: "Maçã", calorias_por_porção: 52, proteína_g: 0.3, carboidrato_g: 14, gordura_g: 0.2, typical_portion_g: 100, image_url: oatBananaImg, alt: "Maçã", price_label: "econômico", affordable_flag: true },

  // Gorduras & complementos
  { id: "gord_azeite", categoria: "Gorduras & Complementos", nome: "Azeite extra virgem", calorias_por_porção: 119, proteína_g: 0, carboidrato_g: 0, gordura_g: 13.5, typical_portion_g: 14, image_url: saladImg, alt: "Azeite", price_label: "médio", affordable_flag: true },
  { id: "gord_chia", categoria: "Gorduras & Complementos", nome: "Sementes de chia", calorias_por_porção: 486, proteína_g: 16, carboidrato_g: 42, gordura_g: 31, typical_portion_g: 100, image_url: saladImg, alt: "Sementes de chia", price_label: "médio", affordable_flag: true },

  // Laticínios
  { id: "lat_leite", categoria: "Laticínios", nome: "Leite", calorias_por_porção: 61, proteína_g: 3.2, carboidrato_g: 4.8, gordura_g: 3.3, typical_portion_g: 100, image_url: oatBananaImg, alt: "Leite", price_label: "médio", affordable_flag: true, lactose: true },
  { id: "lat_iogurte", categoria: "Laticínios", nome: "Iogurte natural", calorias_por_porção: 63, proteína_g: 5.3, carboidrato_g: 7, gordura_g: 1.7, typical_portion_g: 100, image_url: oatBananaImg, alt: "Iogurte natural", price_label: "médio", affordable_flag: true, lactose: true },

  // Snacks
  { id: "snack_pipoca", categoria: "Snacks", nome: "Pipoca (sem óleo)", calorias_por_porção: 387, proteína_g: 13, carboidrato_g: 78, gordura_g: 4.5, typical_portion_g: 100, image_url: saladImg, alt: "Pipoca", price_label: "econômico", affordable_flag: true },
  { id: "snack_ovos_cozidos", categoria: "Snacks", nome: "Ovos cozidos", calorias_por_porção: 155, proteína_g: 13, carboidrato_g: 1.1, gordura_g: 11, typical_portion_g: 100, image_url: chickenImg, alt: "Ovos cozidos", price_label: "econômico", affordable_flag: true },

  // Bebidas
  { id: "bebida_agua", categoria: "Bebidas", nome: "Água", calorias_por_porção: 0, proteína_g: 0, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 250, image_url: saladImg, alt: "Copo de água", price_label: "econômico", affordable_flag: true },
  { id: "bebida_cafe", categoria: "Bebidas", nome: "Café sem açúcar", calorias_por_porção: 2, proteína_g: 0.3, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 200, image_url: saladImg, alt: "Xícara de café", price_label: "econômico", affordable_flag: true },
];
