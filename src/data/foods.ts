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
import beefImg from "@/assets/food-beef.jpg";
import porkImg from "@/assets/food-pork.jpg";
import fishImg from "@/assets/food-fish.jpg";
import eggsImg from "@/assets/food-eggs.jpg";
import liverImg from "@/assets/food-liver.jpg";
import pastaImg from "@/assets/food-pasta.jpg";
import dairyImg from "@/assets/food-dairy.jpg";
import popcornImg from "@/assets/food-popcorn.jpg";
import waterImg from "@/assets/food-water.jpg";
import coffeeImg from "@/assets/food-coffee.jpg";

export const FOODS: FoodItem[] = [
  // Proteínas (Animais) — apenas proteína animal
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
    alt: "Peito de frango grelhado",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "proteina_bovina",
    categoria: "Proteínas (Animais)",
    nome: "Carne bovina",
    calorias_por_porção: 217,
    proteína_g: 26,
    carboidrato_g: 0,
    gordura_g: 12,
    typical_portion_g: 100,
    image_url: beefImg,
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
    image_url: porkImg,
    alt: "Carne suína grelhada",
    price_label: "médio",
    affordable_flag: false,
  },
  {
    id: "proteina_ovos",
    categoria: "Proteínas (Animais)",
    nome: "Ovos",
    calorias_por_porção: 155,
    proteína_g: 13,
    carboidrato_g: 1.1,
    gordura_g: 11,
    typical_portion_g: 100,
    image_url: eggsImg,
    alt: "Ovos cozidos",
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
    id: "carb_macarrao_integral",
    categoria: "Carboidratos",
    nome: "Macarrão integral",
    calorias_por_porção: 124,
    proteína_g: 5,
    carboidrato_g: 27,
    gordura_g: 0.9,
    typical_portion_g: 100,
    image_url: pastaImg,
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
    id: "carb_mandioca",
    categoria: "Carboidratos",
    nome: "Mandioca",
    calorias_por_porção: 160,
    proteína_g: 1.4,
    carboidrato_g: 38,
    gordura_g: 0.3,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Mandioca cozida",
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
    image_url: riceBeansImg,
    alt: "Cuscuz de milho",
    price_label: "econômico",
    affordable_flag: true,
  },
  {
    id: "carb_tapioca",
    categoria: "Carboidratos",
    nome: "Tapioca",
    calorias_por_porção: 160,
    proteína_g: 0.2,
    carboidrato_g: 39,
    gordura_g: 0.2,
    typical_portion_g: 100,
    image_url: riceBeansImg,
    alt: "Tapioca",
    price_label: "econômico",
    affordable_flag: true,
    glúten: false,
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
    glúten: true,
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
  {
    id: "carb_quinoa",
    categoria: "Carboidratos",
    nome: "Quinoa",
    calorias_por_porção: 120,
    proteína_g: 4.4,
    carboidrato_g: 21.3,
    gordura_g: 1.9,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Quinoa cozida",
    price_label: "caro",
    affordable_flag: false,
  },
  {
    id: "carb_farofa",
    categoria: "Carboidratos",
    nome: "Farofa",
    calorias_por_porção: 380,
    proteína_g: 3.5,
    carboidrato_g: 72,
    gordura_g: 8,
    typical_portion_g: 100,
    image_url: riceBeansImg,
    alt: "Farofa",
    price_label: "econômico",
    affordable_flag: true,
  },

  // Leguminosas (separadas das proteínas animais)
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
  {
    id: "legum_grao_bico",
    categoria: "Leguminosas",
    nome: "Grão-de-bico",
    calorias_por_porção: 164,
    proteína_g: 9,
    carboidrato_g: 27,
    gordura_g: 2.6,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Grão-de-bico cozido",
    price_label: "médio",
    affordable_flag: true,
  },
  {
    id: "legum_ervilha",
    categoria: "Leguminosas",
    nome: "Ervilha",
    calorias_por_porção: 81,
    proteína_g: 5.4,
    carboidrato_g: 14,
    gordura_g: 0.4,
    typical_portion_g: 100,
    image_url: saladImg,
    alt: "Ervilhas",
    price_label: "econômico",
    affordable_flag: true,
  },

  // Legumes & Verduras
  { id: "veg_brocolis", categoria: "Legumes & Verduras", nome: "Brócolis", calorias_por_porção: 35, proteína_g: 2.4, carboidrato_g: 7, gordura_g: 0.4, typical_portion_g: 100, image_url: saladImg, alt: "Brócolis cozido", price_label: "econômico", affordable_flag: true },
  { id: "veg_cenoura", categoria: "Legumes & Verduras", nome: "Cenoura", calorias_por_porção: 41, proteína_g: 0.9, carboidrato_g: 10, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Cenoura fatiada", price_label: "econômico", affordable_flag: true },
  { id: "veg_espinafre", categoria: "Legumes & Verduras", nome: "Espinafre", calorias_por_porção: 23, proteína_g: 2.9, carboidrato_g: 3.6, gordura_g: 0.4, typical_portion_g: 100, image_url: saladImg, alt: "Espinafre", price_label: "econômico", affordable_flag: true },
  { id: "veg_couve", categoria: "Legumes & Verduras", nome: "Couve", calorias_por_porção: 49, proteína_g: 4.3, carboidrato_g: 8.8, gordura_g: 0.9, typical_portion_g: 100, image_url: saladImg, alt: "Couve refogada", price_label: "econômico", affordable_flag: true },
  { id: "veg_alface", categoria: "Legumes & Verduras", nome: "Alface", calorias_por_porção: 15, proteína_g: 1.4, carboidrato_g: 2.9, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Folhas de alface", price_label: "econômico", affordable_flag: true },
  { id: "veg_tomate", categoria: "Legumes & Verduras", nome: "Tomate", calorias_por_porção: 18, proteína_g: 0.9, carboidrato_g: 3.9, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Tomate fresco", price_label: "econômico", affordable_flag: true },
  { id: "veg_pepino", categoria: "Legumes & Verduras", nome: "Pepino", calorias_por_porção: 16, proteína_g: 0.7, carboidrato_g: 3.8, gordura_g: 0.1, typical_portion_g: 100, image_url: saladImg, alt: "Pepino fatiado", price_label: "econômico", affordable_flag: true },
  { id: "veg_pimentao", categoria: "Legumes & Verduras", nome: "Pimentão", calorias_por_porção: 31, proteína_g: 1, carboidrato_g: 6, gordura_g: 0.3, typical_portion_g: 100, image_url: saladImg, alt: "Pimentão", price_label: "econômico", affordable_flag: true },
  { id: "veg_rucula", categoria: "Legumes & Verduras", nome: "Rúcula", calorias_por_porção: 25, proteína_g: 2.6, carboidrato_g: 3.7, gordura_g: 0.7, typical_portion_g: 100, image_url: saladImg, alt: "Rúcula", price_label: "econômico", affordable_flag: true },
  { id: "veg_cebola", categoria: "Legumes & Verduras", nome: "Cebola", calorias_por_porção: 40, proteína_g: 1.1, carboidrato_g: 9.3, gordura_g: 0.1, typical_portion_g: 100, image_url: saladImg, alt: "Cebola", price_label: "econômico", affordable_flag: true },
  { id: "veg_alho", categoria: "Legumes & Verduras", nome: "Alho", calorias_por_porção: 149, proteína_g: 6.4, carboidrato_g: 33, gordura_g: 0.5, typical_portion_g: 100, image_url: saladImg, alt: "Dentes de alho", price_label: "econômico", affordable_flag: true },
  { id: "veg_beterraba", categoria: "Legumes & Verduras", nome: "Beterraba", calorias_por_porção: 43, proteína_g: 1.6, carboidrato_g: 10, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Beterraba cozida", price_label: "econômico", affordable_flag: true },

  // Frutas
  { id: "fruta_banana", categoria: "Frutas", nome: "Banana", calorias_por_porção: 89, proteína_g: 1.1, carboidrato_g: 23, gordura_g: 0.3, typical_portion_g: 100, image_url: oatBananaImg, alt: "Banana fatiada", price_label: "econômico", affordable_flag: true },
  { id: "fruta_maca", categoria: "Frutas", nome: "Maçã", calorias_por_porção: 52, proteína_g: 0.3, carboidrato_g: 14, gordura_g: 0.2, typical_portion_g: 100, image_url: oatBananaImg, alt: "Maçã", price_label: "econômico", affordable_flag: true },
  { id: "fruta_uva", categoria: "Frutas", nome: "Uva", calorias_por_porção: 69, proteína_g: 0.7, carboidrato_g: 18, gordura_g: 0.2, typical_portion_g: 100, image_url: saladImg, alt: "Uvas", price_label: "médio", affordable_flag: true },
  { id: "fruta_laranja", categoria: "Frutas", nome: "Laranja", calorias_por_porção: 47, proteína_g: 0.9, carboidrato_g: 12, gordura_g: 0.1, typical_portion_g: 100, image_url: saladImg, alt: "Laranja", price_label: "econômico", affordable_flag: true },
  { id: "fruta_abacaxi", categoria: "Frutas", nome: "Abacaxi", calorias_por_porção: 50, proteína_g: 0.5, carboidrato_g: 13, gordura_g: 0.1, typical_portion_g: 100, image_url: saladImg, alt: "Abacaxi", price_label: "econômico", affordable_flag: true },
  { id: "fruta_mamao", categoria: "Frutas", nome: "Mamão", calorias_por_porção: 43, proteína_g: 0.5, carboidrato_g: 11, gordura_g: 0.3, typical_portion_g: 100, image_url: saladImg, alt: "Mamão", price_label: "econômico", affordable_flag: true },
  { id: "fruta_manga", categoria: "Frutas", nome: "Manga", calorias_por_porção: 60, proteína_g: 0.8, carboidrato_g: 15, gordura_g: 0.4, typical_portion_g: 100, image_url: saladImg, alt: "Manga", price_label: "médio", affordable_flag: true },
  { id: "fruta_limao", categoria: "Frutas", nome: "Limão", calorias_por_porção: 29, proteína_g: 1.1, carboidrato_g: 9.3, gordura_g: 0.3, typical_portion_g: 100, image_url: saladImg, alt: "Limão", price_label: "econômico", affordable_flag: true },

  // Gorduras & Complementos
  { id: "gord_abacate", categoria: "Gorduras & Complementos", nome: "Abacate", calorias_por_porção: 160, proteína_g: 2, carboidrato_g: 9, gordura_g: 15, typical_portion_g: 100, image_url: saladImg, alt: "Abacate", price_label: "médio", affordable_flag: true },
  { id: "gord_azeite", categoria: "Gorduras & Complementos", nome: "Azeite extra virgem", calorias_por_porção: 119, proteína_g: 0, carboidrato_g: 0, gordura_g: 13.5, typical_portion_g: 14, image_url: saladImg, alt: "Azeite", price_label: "médio", affordable_flag: true },
  { id: "gord_castanhas", categoria: "Gorduras & Complementos", nome: "Castanhas (caju, castanha-do-pará)", calorias_por_porção: 607, proteína_g: 14, carboidrato_g: 30, gordura_g: 54, typical_portion_g: 100, image_url: saladImg, alt: "Castanhas", price_label: "caro", affordable_flag: false },
  { id: "gord_sementes", categoria: "Gorduras & Complementos", nome: "Sementes (chia, linhaça, girassol)", calorias_por_porção: 486, proteína_g: 16, carboidrato_g: 42, gordura_g: 31, typical_portion_g: 100, image_url: saladImg, alt: "Sementes", price_label: "médio", affordable_flag: true },

  // Laticínios & Derivados
  { id: "lat_leite", categoria: "Laticínios", nome: "Leite", calorias_por_porção: 61, proteína_g: 3.2, carboidrato_g: 4.8, gordura_g: 3.3, typical_portion_g: 100, image_url: dairyImg, alt: "Leite", price_label: "médio", affordable_flag: true, lactose: true },
  { id: "lat_queijo_minas", categoria: "Laticínios", nome: "Queijo minas", calorias_por_porção: 264, proteína_g: 18, carboidrato_g: 3.2, gordura_g: 20, typical_portion_g: 100, image_url: dairyImg, alt: "Queijo minas", price_label: "médio", affordable_flag: true, lactose: true },
  { id: "lat_queijo_fresco", categoria: "Laticínios", nome: "Queijo fresco", calorias_por_porção: 296, proteína_g: 25, carboidrato_g: 2.4, gordura_g: 21, typical_portion_g: 100, image_url: dairyImg, alt: "Queijo fresco", price_label: "médio", affordable_flag: true, lactose: true },
  { id: "lat_iogurte", categoria: "Laticínios", nome: "Iogurte natural", calorias_por_porção: 63, proteína_g: 5.3, carboidrato_g: 7, gordura_g: 1.7, typical_portion_g: 100, image_url: dairyImg, alt: "Iogurte natural", price_label: "médio", affordable_flag: true, lactose: true },
  { id: "lat_requeijao", categoria: "Laticínios", nome: "Requeijão (opcional)", calorias_por_porção: 257, proteína_g: 7, carboidrato_g: 3, gordura_g: 23, typical_portion_g: 100, image_url: dairyImg, alt: "Requeijão", price_label: "médio", affordable_flag: true, lactose: true },

  // Snacks saudáveis e acompanhamentos
  { id: "snack_pipoca", categoria: "Snacks", nome: "Pipoca (sem óleo)", calorias_por_porção: 387, proteína_g: 13, carboidrato_g: 78, gordura_g: 4.5, typical_portion_g: 100, image_url: popcornImg, alt: "Pipoca", price_label: "econômico", affordable_flag: true },
  { id: "snack_torradas_integral", categoria: "Snacks", nome: "Torradas integrais", calorias_por_porção: 410, proteína_g: 13, carboidrato_g: 68, gordura_g: 9, typical_portion_g: 100, image_url: oatBananaImg, alt: "Torradas integrais", price_label: "médio", affordable_flag: true, glúten: true },
  { id: "snack_frutas_secas", categoria: "Snacks", nome: "Frutas secas", calorias_por_porção: 300, proteína_g: 3, carboidrato_g: 80, gordura_g: 1, typical_portion_g: 100, image_url: oatBananaImg, alt: "Frutas secas", price_label: "médio", affordable_flag: true },
  { id: "snack_ovos_cozidos", categoria: "Snacks", nome: "Ovos cozidos", calorias_por_porção: 155, proteína_g: 13, carboidrato_g: 1.1, gordura_g: 11, typical_portion_g: 100, image_url: eggsImg, alt: "Ovos cozidos", price_label: "econômico", affordable_flag: true },
  { id: "snack_iogurte", categoria: "Snacks", nome: "Iogurte natural", calorias_por_porção: 63, proteína_g: 5.3, carboidrato_g: 7, gordura_g: 1.7, typical_portion_g: 100, image_url: dairyImg, alt: "Iogurte natural", price_label: "médio", affordable_flag: true, lactose: true },

  // Bebidas práticas
  { id: "bebida_agua", categoria: "Bebidas", nome: "Água", calorias_por_porção: 0, proteína_g: 0, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 250, image_url: waterImg, alt: "Copo de água", price_label: "econômico", affordable_flag: true },
  { id: "bebida_refri_zero", categoria: "Bebidas", nome: "Refrigerante Zero", calorias_por_porção: 0, proteína_g: 0, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 350, image_url: waterImg, alt: "Lata de refrigerante zero", price_label: "médio", affordable_flag: true },
  { id: "bebida_cha", categoria: "Bebidas", nome: "Chá (diversos)", calorias_por_porção: 2, proteína_g: 0, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 200, image_url: waterImg, alt: "Xícara de chá", price_label: "econômico", affordable_flag: true },
  { id: "bebida_cafe", categoria: "Bebidas", nome: "Café (sem açúcar)", calorias_por_porção: 2, proteína_g: 0.3, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 200, image_url: coffeeImg, alt: "Xícara de café", price_label: "econômico", affordable_flag: true },
  { id: "bebida_suco_natural", categoria: "Bebidas", nome: "Suco natural (moderação)", calorias_por_porção: 40, proteína_g: 0.5, carboidrato_g: 9, gordura_g: 0.1, typical_portion_g: 200, image_url: waterImg, alt: "Copo de suco natural", price_label: "médio", affordable_flag: true },
];
