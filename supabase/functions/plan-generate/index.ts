import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Check auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { total_kcal, gosta_ids, week_start } = await req.json();
    
    console.log(`Generating plan for user ${user.id}, ${total_kcal} kcal, week: ${week_start}`);

    // Enhanced Gemini prompt with detailed food data
    const prompt = `Você é um nutricionista especializado em planejamento alimentar focado em proteína animal e praticidade.

IMPORTANTE: Suas respostas devem ser em formato JSON válido, sem markdown ou texto adicional.

DADOS DOS ALIMENTOS DISPONÍVEIS:
${JSON.stringify([
  // Proteínas
  { id: "proteina_frango", nome: "Aves (frango)", categoria: "Proteínas (Animais)", calorias_por_porção: 165, proteína_g: 31, carboidrato_g: 0, gordura_g: 3.6, typical_portion_g: 100 },
  { id: "proteina_bovina", nome: "Carne bovina", categoria: "Proteínas (Animais)", calorias_por_porção: 217, proteína_g: 26, carboidrato_g: 0, gordura_g: 12, typical_portion_g: 100 },
  { id: "proteina_porco", nome: "Porco", categoria: "Proteínas (Animais)", calorias_por_porção: 242, proteína_g: 27, carboidrato_g: 0, gordura_g: 14, typical_portion_g: 100 },
  { id: "proteina_ovos", nome: "Ovos", categoria: "Proteínas (Animais)", calorias_por_porção: 155, proteína_g: 13, carboidrato_g: 1.1, gordura_g: 11, typical_portion_g: 100 },
  
  // Carboidratos
  { id: "carb_arroz_integral", nome: "Arroz integral", categoria: "Carboidratos", calorias_por_porção: 111, proteína_g: 2.6, carboidrato_g: 23, gordura_g: 0.9, typical_portion_g: 100 },
  { id: "carb_batata_doce", nome: "Batata doce", categoria: "Carboidratos", calorias_por_porção: 86, proteína_g: 1.6, carboidrato_g: 20, gordura_g: 0.1, typical_portion_g: 100 },
  { id: "carb_macarrao_integral", nome: "Macarrão integral", categoria: "Carboidratos", calorias_por_porção: 124, proteína_g: 5, carboidrato_g: 27, gordura_g: 0.9, typical_portion_g: 100 },
  { id: "carb_pao_integral", nome: "Pão integral", categoria: "Carboidratos", calorias_por_porção: 247, proteína_g: 13, carboidrato_g: 41, gordura_g: 4.2, typical_portion_g: 100 },
  { id: "carb_aveia", nome: "Aveia", categoria: "Carboidratos", calorias_por_porção: 389, proteína_g: 17, carboidrato_g: 66, gordura_g: 7, typical_portion_g: 100 },
  
  // Leguminosas
  { id: "legum_feijao", nome: "Feijão", categoria: "Leguminosas", calorias_por_porção: 127, proteína_g: 9, carboidrato_g: 23, gordura_g: 0.5, typical_portion_g: 100 },
  { id: "legum_lentilha", nome: "Lentilha", categoria: "Leguminosas", calorias_por_porção: 116, proteína_g: 9, carboidrato_g: 20, gordura_g: 0.4, typical_portion_g: 100 },
  
  // Verduras
  { id: "veg_brocolis", nome: "Brócolis", categoria: "Legumes & Verduras", calorias_por_porção: 35, proteína_g: 2.4, carboidrato_g: 7, gordura_g: 0.4, typical_portion_g: 100 },
  { id: "veg_cenoura", nome: "Cenoura", categoria: "Legumes & Verduras", calorias_por_porção: 41, proteína_g: 0.9, carboidrato_g: 10, gordura_g: 0.2, typical_portion_g: 100 },
  { id: "veg_couve", nome: "Couve", categoria: "Legumes & Verduras", calorias_por_porção: 49, proteína_g: 4.3, carboidrato_g: 8.8, gordura_g: 0.9, typical_portion_g: 100 },
  
  // Frutas
  { id: "fruta_banana", nome: "Banana", categoria: "Frutas", calorias_por_porção: 89, proteína_g: 1.1, carboidrato_g: 23, gordura_g: 0.3, typical_portion_g: 100 },
  { id: "fruta_maca", nome: "Maçã", categoria: "Frutas", calorias_por_porção: 52, proteína_g: 0.3, carboidrato_g: 14, gordura_g: 0.2, typical_portion_g: 100 },
  
  // Laticínios
  { id: "lat_iogurte", nome: "Iogurte natural", categoria: "Laticínios", calorias_por_porção: 63, proteína_g: 5.3, carboidrato_g: 7, gordura_g: 1.7, typical_portion_g: 100 },
  
  // Bebidas
  { id: "bebida_cafe", nome: "Café (sem açúcar)", categoria: "Bebidas", calorias_por_porção: 2, proteína_g: 0.3, carboidrato_g: 0, gordura_g: 0, typical_portion_g: 200 },
])}

PREFERÊNCIAS DO USUÁRIO: ${JSON.stringify(gosta_ids)}

REGRAS DE UNIDADES E PORÇÕES:
- Ovos: sempre 2 unidades (não gramas)
- Frutas: 1 unidade (não gramas) 
- Pão integral: 2 fatias (não gramas)
- Queijos: 1 fatia (não gramas)
- Torradas: 3 unidades (não gramas)
- Bebidas: em ml (não gramas)
- Uva: por unidades, não fatias
- Demais alimentos: gramas apropriadas para a refeição

TAREFA:
Crie um plano semanal (7 dias) com ${total_kcal} kcal/dia. Para cada dia:

HORÁRIOS FIXOS:
- Colação: 06:10
- Café: 08:20  
- Almoço: 12:30
- Lanche: 15:30
- Jantar: 19:30
- Ceia: 21:30

DISTRIBUIÇÃO CALÓRICA:
- Café: 20%
- Colação: 10%
- Almoço: 30%
- Lanche: 10%
- Jantar: 25%
- Ceia: 5%

DIRETRIZES:
1. Almoço e Jantar: sempre 1 proteína animal
2. Café da manhã: carboidrato + fruta + bebida
3. Lanche: leve (fruta + iogurte OU aveia + fruta)
4. Porções balanceadas e realistas
5. Varie as proteínas entre os dias
6. Use as preferências do usuário quando possível
7. Calcule nutrição exata baseada nas quantidades

FORMATO DE RESPOSTA (JSON):
{
  "days": [
    {
      "day_name": "Segunda",
      "day_index": 0,
      "meals": [
        {
          "name": "Café",
          "time": "08:20",
          "items": [
            {
              "food_id": "carb_pao_integral",
              "food_name": "Pão integral",
              "category": "Carboidratos",
              "unit": "2 fatias",
              "quantity": 2,
              "quantity_g": 60,
              "calories": 148,
              "protein_g": 7.8,
              "carbs_g": 24.6,
              "fat_g": 2.5
            }
          ]
        }
      ]
    }
  ]
}

Gere APENAS o JSON, sem texto adicional.`;

    // Call Gemini API
    console.log('Calling Gemini API...');
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + encodeURIComponent(geminiApiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'Gemini API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    const geminiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log('Raw Gemini response:', geminiText);
    
    // Parse JSON from Gemini
    let planData;
    try {
      // Remove markdown if present
      const jsonText = geminiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      planData = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', e, geminiText);
      return new Response(JSON.stringify({ error: 'Invalid JSON from Gemini' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database
    console.log('Saving plan to database...');
    
    // Delete existing plan for this week
    await supabase
      .from('meal_plans')
      .delete()
      .eq('user_id', user.id)
      .eq('week_start', week_start);

    // Create meal plan
    const { data: plan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        user_id: user.id,
        week_start,
        total_kcal,
        gosta_ids
      })
      .select()
      .single();

    if (planError) {
      console.error('Plan creation error:', planError);
      return new Response(JSON.stringify({ error: 'Failed to create plan' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create days and meals
    for (const dayData of planData.days) {
      // Create day
      const { data: day, error: dayError } = await supabase
        .from('meal_plan_days')
        .insert({
          plan_id: plan.id,
          day_index: dayData.day_index,
          total_kcal: dayData.meals.reduce((sum: number, meal: any) => 
            sum + meal.items.reduce((mealSum: number, item: any) => mealSum + item.calories, 0), 0
          )
        })
        .select()
        .single();

      if (dayError) {
        console.error('Day creation error:', dayError);
        continue;
      }

      // Create meals for this day
      for (const mealData of dayData.meals) {
        const mealCalories = mealData.items.reduce((sum: number, item: any) => sum + item.calories, 0);
        
        const { data: meal, error: mealError } = await supabase
          .from('meals')
          .insert({
            day_id: day.id,
            name: mealData.name,
            time: mealData.time,
            calories: Math.round(mealCalories)
          })
          .select()
          .single();

        if (mealError) {
          console.error('Meal creation error:', mealError);
          continue;
        }

        // Create meal items
        const mealItems = mealData.items.map((item: any) => ({
          meal_id: meal.id,
          food_id: item.food_id,
          food_name: item.food_name,
          category: item.category,
          unit: item.unit,
          quantity: item.quantity,
          quantity_g: item.quantity_g,
          calories: item.calories,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g
        }));

        const { error: itemsError } = await supabase
          .from('meal_items')
          .insert(mealItems);

        if (itemsError) {
          console.error('Meal items creation error:', itemsError);
        }
      }
    }

    console.log('Plan saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      plan_id: plan.id,
      message: 'Plan generated and saved successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in plan-generate function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});