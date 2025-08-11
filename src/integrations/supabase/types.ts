export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      dish_ingredients: {
        Row: {
          dish_id: string
          food_item_id: string
          preparation_method: string | null
          quantity_grams: number
        }
        Insert: {
          dish_id: string
          food_item_id: string
          preparation_method?: string | null
          quantity_grams: number
        }
        Update: {
          dish_id?: string
          food_item_id?: string
          preparation_method?: string | null
          quantity_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          image_url: string | null
          is_chicken_based: boolean
          meal_type: string
          name: string
          preparation_time_minutes: number | null
          total_calories: number
          total_carbs: number
          total_fat: number
          total_fiber: number
          total_protein: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          is_chicken_based?: boolean
          meal_type: string
          name: string
          preparation_time_minutes?: number | null
          total_calories: number
          total_carbs?: number
          total_fat?: number
          total_fiber?: number
          total_protein?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          is_chicken_based?: boolean
          meal_type?: string
          name?: string
          preparation_time_minutes?: number | null
          total_calories?: number
          total_carbs?: number
          total_fat?: number
          total_fiber?: number
          total_protein?: number
          updated_at?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          calories_per_100g: number
          carbs_per_100g: number
          category: string
          created_at: string
          difficulty_level: string | null
          fat_per_100g: number
          fiber_per_100g: number
          id: string
          image_url: string | null
          is_healthy: boolean
          name: string
          preparation_time_minutes: number | null
          protein_per_100g: number
          sodium_mg_per_100g: number
          sugars_per_100g: number
          updated_at: string
        }
        Insert: {
          calories_per_100g: number
          carbs_per_100g?: number
          category: string
          created_at?: string
          difficulty_level?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number
          id?: string
          image_url?: string | null
          is_healthy?: boolean
          name: string
          preparation_time_minutes?: number | null
          protein_per_100g?: number
          sodium_mg_per_100g?: number
          sugars_per_100g?: number
          updated_at?: string
        }
        Update: {
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string
          created_at?: string
          difficulty_level?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number
          id?: string
          image_url?: string | null
          is_healthy?: boolean
          name?: string
          preparation_time_minutes?: number | null
          protein_per_100g?: number
          sodium_mg_per_100g?: number
          sugars_per_100g?: number
          updated_at?: string
        }
        Relationships: []
      }
      generated_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
      plan_meals: {
        Row: {
          alternatives: Json
          day_of_week: number
          dish_id: string
          id: string
          meal_type: string
          plan_id: string
        }
        Insert: {
          alternatives?: Json
          day_of_week: number
          dish_id: string
          id?: string
          meal_type: string
          plan_id: string
        }
        Update: {
          alternatives?: Json
          day_of_week?: number
          dish_id?: string
          id?: string
          meal_type?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_meals_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_meals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "generated_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          api_key_gemini_encrypted: string | null
          created_at: string
          daily_calorie_target: number
          email: string | null
          id: string
          name: string | null
          preferences_completed: boolean
          updated_at: string
        }
        Insert: {
          api_key_gemini_encrypted?: string | null
          created_at?: string
          daily_calorie_target?: number
          email?: string | null
          id: string
          name?: string | null
          preferences_completed?: boolean
          updated_at?: string
        }
        Update: {
          api_key_gemini_encrypted?: string | null
          created_at?: string
          daily_calorie_target?: number
          email?: string | null
          id?: string
          name?: string | null
          preferences_completed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_meal_history: {
        Row: {
          consumed_date: string
          created_at: string
          dish_id: string
          id: string
          meal_type: string
          user_id: string
        }
        Insert: {
          consumed_date: string
          created_at?: string
          dish_id: string
          id?: string
          meal_type: string
          user_id: string
        }
        Update: {
          consumed_date?: string
          created_at?: string
          dish_id?: string
          id?: string
          meal_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meal_history_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          preference_level: number
          user_id: string
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          preference_level: number
          user_id: string
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          preference_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
