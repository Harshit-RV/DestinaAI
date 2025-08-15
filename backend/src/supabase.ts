export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      day_plan: {
        Row: {
          activities: Json | null
          created_at: string
          id: number
          title: string | null
          weather_forcast: Json | null
        }
        Insert: {
          activities?: Json | null
          created_at?: string
          id?: number
          title?: string | null
          weather_forcast?: Json | null
        }
        Update: {
          activities?: Json | null
          created_at?: string
          id?: number
          title?: string | null
          weather_forcast?: Json | null
        }
        Relationships: []
      }
      dummy: {
        Row: {
          age: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flight_data: {
        Row: {
          airline_logo: string | null
          carbon_emissions: Json | null
          created_at: string | null
          departure_token: string | null
          extensions: string[] | null
          flights: Json | null
          id: number
          layovers: Json | null
          price: number | null
          total_duration: number | null
          type: string | null
        }
        Insert: {
          airline_logo?: string | null
          carbon_emissions?: Json | null
          created_at?: string | null
          departure_token?: string | null
          extensions?: string[] | null
          flights?: Json | null
          id?: number
          layovers?: Json | null
          price?: number | null
          total_duration?: number | null
          type?: string | null
        }
        Update: {
          airline_logo?: string | null
          carbon_emissions?: Json | null
          created_at?: string | null
          departure_token?: string | null
          extensions?: string[] | null
          flights?: Json | null
          id?: number
          layovers?: Json | null
          price?: number | null
          total_duration?: number | null
          type?: string | null
        }
        Relationships: []
      }
      hotel_data: {
        Row: {
          available: boolean | null
          carbon_emissions: Json | null
          created_at: string | null
          hotel: Json | null
          id: number
          images: Json | null
          offers: Json | null
          photoUrl: string[] | null
          self: string | null
          type: string | null
        }
        Insert: {
          available?: boolean | null
          carbon_emissions?: Json | null
          created_at?: string | null
          hotel?: Json | null
          id?: number
          images?: Json | null
          offers?: Json | null
          photoUrl?: string[] | null
          self?: string | null
          type?: string | null
        }
        Update: {
          available?: boolean | null
          carbon_emissions?: Json | null
          created_at?: string | null
          hotel?: Json | null
          id?: number
          images?: Json | null
          offers?: Json | null
          photoUrl?: string[] | null
          self?: string | null
          type?: string | null
        }
        Relationships: []
      }
      plan_change: {
        Row: {
          activityName: string | null
          changeType: string | null
          created_at: string | null
          explanation: string | null
          id: number
          newDay: string | null
          originalDay: string | null
          reason: string | null
        }
        Insert: {
          activityName?: string | null
          changeType?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: number
          newDay?: string | null
          originalDay?: string | null
          reason?: string | null
        }
        Update: {
          activityName?: string | null
          changeType?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: number
          newDay?: string | null
          originalDay?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          arrivalAirportCode: string[] | null
          arrivalLocation: string | null
          created_at: number | null
          dayPlan: number | null
          departureAirportCode: string[] | null
          departureDate: string | null
          departureLocation: string | null
          destinationArrivalTime: string | null
          destinationCityCommonName: string | null
          estimatedCarbonEmissionFromActivities: string | null
          hotelPreferences: string[] | null
          id: number
          interests: string[] | null
          maximumBudget: number | null
          minimumBudget: number | null
          numberOfAdults: number | null
          numberOfChildren: number | null
          planChanges: number | null
          returnDate: string | null
          returnDateTime: string | null
          selectedHotel: number | null
          selectedOutboundFlight: number | null
          selectedReturnFlight: number | null
          userId: string | null
        }
        Insert: {
          arrivalAirportCode?: string[] | null
          arrivalLocation?: string | null
          created_at?: number | null
          dayPlan?: number | null
          departureAirportCode?: string[] | null
          departureDate?: string | null
          departureLocation?: string | null
          destinationArrivalTime?: string | null
          destinationCityCommonName?: string | null
          estimatedCarbonEmissionFromActivities?: string | null
          hotelPreferences?: string[] | null
          id?: number
          interests?: string[] | null
          maximumBudget?: number | null
          minimumBudget?: number | null
          numberOfAdults?: number | null
          numberOfChildren?: number | null
          planChanges?: number | null
          returnDate?: string | null
          returnDateTime?: string | null
          selectedHotel?: number | null
          selectedOutboundFlight?: number | null
          selectedReturnFlight?: number | null
          userId?: string | null
        }
        Update: {
          arrivalAirportCode?: string[] | null
          arrivalLocation?: string | null
          created_at?: number | null
          dayPlan?: number | null
          departureAirportCode?: string[] | null
          departureDate?: string | null
          departureLocation?: string | null
          destinationArrivalTime?: string | null
          destinationCityCommonName?: string | null
          estimatedCarbonEmissionFromActivities?: string | null
          hotelPreferences?: string[] | null
          id?: number
          interests?: string[] | null
          maximumBudget?: number | null
          minimumBudget?: number | null
          numberOfAdults?: number | null
          numberOfChildren?: number | null
          planChanges?: number | null
          returnDate?: string | null
          returnDateTime?: string | null
          selectedHotel?: number | null
          selectedOutboundFlight?: number | null
          selectedReturnFlight?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_day_plan"
            columns: ["dayPlan"]
            isOneToOne: false
            referencedRelation: "day_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plan_changes"
            columns: ["planChanges"]
            isOneToOne: false
            referencedRelation: "plan_change"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_selected_hotel"
            columns: ["selectedHotel"]
            isOneToOne: false
            referencedRelation: "hotel_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_selected_outbound_flight"
            columns: ["selectedOutboundFlight"]
            isOneToOne: false
            referencedRelation: "flight_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_selected_return_flight"
            columns: ["selectedReturnFlight"]
            isOneToOne: false
            referencedRelation: "flight_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
