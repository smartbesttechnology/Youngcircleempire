export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          enabled: boolean | null
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      booking_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          addons: string[]
          booking_date: string
          booking_time: string
          contact_method: string
          created_at: string | null
          duration: string | null
          email: string
          first_name: string
          id: string
          instagram_handle: string | null
          last_name: string
          notes: string | null
          people: string | null
          phone: string
          services: string[]
          status: string | null
          tiktok_handle: string | null
          updated_at: string | null
        }
        Insert: {
          addons?: string[]
          booking_date: string
          booking_time: string
          contact_method?: string
          created_at?: string | null
          duration?: string | null
          email: string
          first_name: string
          id?: string
          instagram_handle?: string | null
          last_name: string
          notes?: string | null
          people?: string | null
          phone: string
          services: string[]
          status?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          addons?: string[]
          booking_date?: string
          booking_time?: string
          contact_method?: string
          created_at?: string | null
          duration?: string | null
          email?: string
          first_name?: string
          id?: string
          instagram_handle?: string | null
          last_name?: string
          notes?: string | null
          people?: string | null
          phone?: string
          services?: string[]
          status?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_items: {
        Row: {
          category_id: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          image_url: string | null
          name: string
          price_per_hour: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          price_per_hour?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          price_per_hour?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "equipment_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment_rentals: {
        Row: {
          contact_method: string | null
          created_at: string | null
          duration: string | null
          email: string
          equipment: string[]
          first_name: string
          id: number
          instagram_handle: string | null
          last_name: string
          notes: string | null
          phone: string
          pickup_date: string
          pickup_time: string
          quantity: Json | null
          return_date: string
          return_time: string
          status: string | null
          tiktok_handle: string | null
          updated_at: string | null
        }
        Insert: {
          contact_method?: string | null
          created_at?: string | null
          duration?: string | null
          email: string
          equipment: string[]
          first_name: string
          id?: number
          instagram_handle?: string | null
          last_name: string
          notes?: string | null
          phone: string
          pickup_date: string
          pickup_time: string
          quantity?: Json | null
          return_date: string
          return_time: string
          status?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_method?: string | null
          created_at?: string | null
          duration?: string | null
          email?: string
          equipment?: string[]
          first_name?: string
          id?: number
          instagram_handle?: string | null
          last_name?: string
          notes?: string | null
          phone?: string
          pickup_date?: string
          pickup_time?: string
          quantity?: Json | null
          return_date?: string
          return_time?: string
          status?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string | null
          display_order: number
          icon: string | null
          id: string
          title: string
          updated_at: string | null
          url: string
          user_id: string
          visible: boolean
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title: string
          updated_at?: string | null
          url: string
          user_id: string
          visible?: boolean
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          enabled: boolean | null
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          enabled?: boolean | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "booking_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          profile_image: string | null
          theme: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          profile_image?: string | null
          theme?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          profile_image?: string | null
          theme?: string | null
          updated_at?: string | null
          username?: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
