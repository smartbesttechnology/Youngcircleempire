export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          enabled: boolean | null;
          id: string;
          name: string;
          price: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          name: string;
          price?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          name?: string;
          price?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          created_at: string | null;
          id: string;
          setting_key: string;
          setting_value: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          setting_key: string;
          setting_value?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          setting_key?: string;
          setting_value?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          addons: string[];
          booking_date: string;
          booking_time: string;
          contact_method: string;
          created_at: string | null;
          duration: string | null;
          email: string;
          first_name: string;
          id: string;
          instagram_handle: string | null;
          last_name: string;
          notes: string | null;
          people: string | null;
          phone: string;
          services: string[];
          status: string | null;
          tiktok_handle: string | null;
          updated_at: string | null;
        };
        Insert: {
          addons?: string[];
          booking_date: string;
          booking_time: string;
          contact_method?: string;
          created_at?: string | null;
          duration?: string | null;
          email: string;
          first_name: string;
          id?: string;
          instagram_handle?: string | null;
          last_name: string;
          notes?: string | null;
          people?: string | null;
          phone: string;
          services: string[];
          status?: string | null;
          tiktok_handle?: string | null;
          updated_at?: string | null;
        };
        Update: {
          addons?: string[];
          booking_date?: string;
          booking_time?: string;
          contact_method?: string;
          created_at?: string | null;
          duration?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          instagram_handle?: string | null;
          last_name?: string;
          notes?: string | null;
          people?: string | null;
          phone?: string;
          services?: string[];
          status?: string | null;
          tiktok_handle?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      bundles: {
        Row: {
          addons: Json | null;
          created_at: string | null;
          description: string | null;
          discount_percentage: number | null;
          enabled: boolean | null;
          equipment: Json | null;
          id: string;
          name: string;
          services: Json | null;
          total_price: number | null;
          updated_at: string | null;
        };
        Insert: {
          addons?: Json | null;
          created_at?: string | null;
          description?: string | null;
          discount_percentage?: number | null;
          enabled?: boolean | null;
          equipment?: Json | null;
          id?: string;
          name: string;
          services?: Json | null;
          total_price?: number | null;
          updated_at?: string | null;
        };
        Update: {
          addons?: Json | null;
          created_at?: string | null;
          description?: string | null;
          discount_percentage?: number | null;
          enabled?: boolean | null;
          equipment?: Json | null;
          id?: string;
          name?: string;
          services?: Json | null;
          total_price?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      equipment: {
        Row: {
          created_at: string | null;
          deposit_amount: number | null;
          deposit_required: boolean | null;
          description: string | null;
          display_order: number | null;
          enabled: boolean | null;
          id: string;
          name: string;
          price: number | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deposit_amount?: number | null;
          deposit_required?: boolean | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          name: string;
          price?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deposit_amount?: number | null;
          deposit_required?: boolean | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          name?: string;
          price?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          addons: Json | null;
          client_email: string;
          client_name: string;
          client_phone: string | null;
          created_at: string | null;
          discount: number | null;
          due_date: string | null;
          equipment: Json | null;
          id: string;
          invoice_number: string;
          payment_method: string | null;
          payment_status: string | null;
          services: Json | null;
          status: string | null;
          subtotal: number;
          total: number;
          updated_at: string | null;
        };
        Insert: {
          addons?: Json | null;
          client_email: string;
          client_name: string;
          client_phone?: string | null;
          created_at?: string | null;
          discount?: number | null;
          due_date?: string | null;
          equipment?: Json | null;
          id?: string;
          invoice_number: string;
          payment_method?: string | null;
          payment_status?: string | null;
          services?: Json | null;
          status?: string | null;
          subtotal?: number;
          total?: number;
          updated_at?: string | null;
        };
        Update: {
          addons?: Json | null;
          client_email?: string;
          client_name?: string;
          client_phone?: string | null;
          created_at?: string | null;
          discount?: number | null;
          due_date?: string | null;
          equipment?: Json | null;
          id?: string;
          invoice_number?: string;
          payment_method?: string | null;
          payment_status?: string | null;
          services?: Json | null;
          status?: string | null;
          subtotal?: number;
          total?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payment_config: {
        Row: {
          created_at: string | null;
          enabled: boolean | null;
          id: string;
          provider: string;
          public_key: string | null;
          secret_key: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          enabled?: boolean | null;
          id?: string;
          provider: string;
          public_key?: string | null;
          secret_key?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          enabled?: boolean | null;
          id?: string;
          provider?: string;
          public_key?: string | null;
          secret_key?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      rentals: {
        Row: {
          created_at: string | null;
          deposit_amount: number | null;
          duration: string;
          email: string;
          equipment_selected: string[];
          id: string;
          name: string;
          payment_method: string | null;
          phone: string;
          pickup_time: string;
          proof_address_url: string | null;
          return_time: string;
          status: string | null;
          updated_at: string | null;
          uploaded_id_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          deposit_amount?: number | null;
          duration: string;
          email: string;
          equipment_selected: string[];
          id?: string;
          name: string;
          payment_method?: string | null;
          phone: string;
          pickup_time: string;
          proof_address_url?: string | null;
          return_time: string;
          status?: string | null;
          updated_at?: string | null;
          uploaded_id_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          deposit_amount?: number | null;
          duration?: string;
          email?: string;
          equipment_selected?: string[];
          id?: string;
          name?: string;
          payment_method?: string | null;
          phone?: string;
          pickup_time?: string;
          proof_address_url?: string | null;
          return_time?: string;
          status?: string | null;
          updated_at?: string | null;
          uploaded_id_url?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          enabled: boolean | null;
          id: string;
          image_url: string | null;
          name: string;
          price: number | null;
          type: string | null;
          updated_at: string | null;
          allow_addons: boolean | null;
          tagline: string | null;
          category_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          image_url?: string | null;
          name: string;
          price?: number | null;
          type?: string | null;
          updated_at?: string | null;
          allow_addons?: boolean | null;
          tagline?: string | null;
          category_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number | null;
          type?: string | null;
          updated_at?: string | null;
          allow_addons?: boolean | null;
          tagline?: string | null;
          category_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          emoji: string | null;
          title: string;
          tagline: string | null;
          description: string | null;
          display_order: number | null;
          enabled: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          emoji?: string | null;
          title: string;
          tagline?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string | null;
          title?: string;
          tagline?: string | null;
          description?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      smart_links: {
        Row: {
          id: string;
          slug: string;
          title: string | null;
          description: string | null;
          image_url: string | null;
          theme: string | null;
          type: string | null;
          created_at: string | null;
          expires_at: string | null;
          enabled: boolean | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title?: string | null;
          description?: string | null;
          image_url?: string | null;
          theme?: string | null;
          type?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          enabled?: boolean | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string | null;
          description?: string | null;
          image_url?: string | null;
          theme?: string | null;
          type?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          enabled?: boolean | null;
        };
        Relationships: [];
      };
      link_buttons: {
        Row: {
          id: string;
          smart_link_id: string;
          label: string;
          icon: string | null;
          target_url: string;
          order: number | null;
          enabled: boolean | null;
        };
        Insert: {
          id?: string;
          smart_link_id: string;
          label: string;
          icon?: string | null;
          target_url: string;
          order?: number | null;
          enabled?: boolean | null;
        };
        Update: {
          id?: string;
          smart_link_id?: string;
          label?: string;
          icon?: string | null;
          target_url?: string;
          order?: number | null;
          enabled?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "link_buttons_smart_link_id_fkey";
            columns: ["smart_link_id"];
            referencedRelation: "smart_links";
            referencedColumns: ["id"];
          },
        ];
      };
      studio_info: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          logo_url: string | null;
          phone: string | null;
          updated_at: string | null;
          whatsapp: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          whatsapp?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
