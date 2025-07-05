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
          contact_method: string
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
        Relationships: [
          {
            foreignKeyName: "users_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_username_reserved: {
        Args: {
          username_to_check: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Custom types for the links application
export type User = Tables<"users">
export type Link = Tables<"links">
export type UserInsert = TablesInsert<"users">
export type LinkInsert = TablesInsert<"links">
export type UserUpdate = TablesUpdate<"users">
export type LinkUpdate = TablesUpdate<"links">
