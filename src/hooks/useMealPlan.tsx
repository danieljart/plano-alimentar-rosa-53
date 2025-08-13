import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface MealItem {
  food_id: string;
  food_name: string;
  category: string;
  unit: string;
  quantity: number;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  items: MealItem[];
}

export interface DayPlan {
  id: string;
  day_index: number;
  day_name: string;
  total_kcal: number;
  meals: Meal[];
}

export interface WeekPlan {
  id: string;
  week_start: string;
  total_kcal: number;
  gosta_ids: string[];
  days: DayPlan[];
}

export function useMealPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current week Monday
  const getCurrentWeekStart = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday.toISOString().split('T')[0];
  };

  const loadPlan = async (weekStart?: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const week = weekStart || getCurrentWeekStart();
      
      // Load plan with all related data
      const { data: planData, error: planError } = await supabase
        .from('meal_plans')
        .select(`
          *,
          meal_plan_days (
            *,
            meals (
              *,
              meal_items (*)
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('week_start', week)
        .single();

      if (planError) {
        if (planError.code === 'PGRST116') {
          // No plan found
          setPlan(null);
        } else {
          throw planError;
        }
      } else {
        // Transform data to match our interface
        const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        
        const transformedPlan: WeekPlan = {
          id: planData.id,
          week_start: planData.week_start,
          total_kcal: planData.total_kcal,
          gosta_ids: planData.gosta_ids,
          days: planData.meal_plan_days
            .sort((a: any, b: any) => a.day_index - b.day_index)
            .map((day: any) => ({
              id: day.id,
              day_index: day.day_index,
              day_name: dayNames[day.day_index] || `Dia ${day.day_index + 1}`,
              total_kcal: day.total_kcal,
              meals: day.meals
                .sort((a: any, b: any) => a.time.localeCompare(b.time))
                .map((meal: any) => ({
                  id: meal.id,
                  name: meal.name,
                  time: meal.time,
                  calories: meal.calories,
                  items: meal.meal_items
                }))
            }))
        };

        setPlan(transformedPlan);
      }
    } catch (err: any) {
      console.error('Error loading meal plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (totalKcal: number, gostaIds: string[]) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const weekStart = getCurrentWeekStart();
      
      const { data, error } = await supabase.functions.invoke('plan-generate', {
        body: {
          total_kcal: totalKcal,
          gosta_ids: gostaIds,
          week_start: weekStart
        }
      });

      if (error) throw error;
      
      // Reload the plan after generation
      await loadPlan(weekStart);
      
      return data;
    } catch (err: any) {
      console.error('Error generating meal plan:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load plan on mount and when user changes
  useEffect(() => {
    if (user) {
      loadPlan();
    }
  }, [user]);

  return {
    plan,
    loading,
    error,
    loadPlan,
    generatePlan,
    getCurrentWeekStart
  };
}