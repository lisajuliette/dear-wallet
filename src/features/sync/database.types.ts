export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      diary_entries: {
        Row: {
          body: string;
          created_at: string;
          deleted_at: string | null;
          entry_date: string;
          id: string;
          mood: string | null;
          prompt_id: string | null;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          body?: string;
          created_at?: string;
          deleted_at?: string | null;
          entry_date: string;
          id: string;
          mood?: string | null;
          prompt_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          deleted_at?: string | null;
          entry_date?: string;
          id?: string;
          mood?: string | null;
          prompt_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          archived_at: string | null;
          created_at: string;
          deleted_at: string | null;
          id: string;
          name: string;
          reached_at: string | null;
          started_at: string;
          target_cents: number;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id: string;
          name: string;
          reached_at?: string | null;
          started_at?: string;
          target_cents: number;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          name?: string;
          reached_at?: string | null;
          started_at?: string;
          target_cents?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          amount_cents: number | null;
          bought_after_all_at: string | null;
          category: string | null;
          created_at: string;
          currency: string;
          deleted_at: string | null;
          happened_at: string;
          id: string;
          kind: string;
          name: string;
          note: string | null;
          photo_path: string | null;
          tag: string | null;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          amount_cents?: number | null;
          bought_after_all_at?: string | null;
          category?: string | null;
          created_at?: string;
          currency?: string;
          deleted_at?: string | null;
          happened_at?: string;
          id: string;
          kind: string;
          name: string;
          note?: string | null;
          photo_path?: string | null;
          tag?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          amount_cents?: number | null;
          bought_after_all_at?: string | null;
          category?: string | null;
          created_at?: string;
          currency?: string;
          deleted_at?: string | null;
          happened_at?: string;
          id?: string;
          kind?: string;
          name?: string;
          note?: string | null;
          photo_path?: string | null;
          tag?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          achieved_at: string;
          milestone_id: string;
          seen_at: string | null;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          achieved_at?: string;
          milestone_id: string;
          seen_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          achieved_at?: string;
          milestone_id?: string;
          seen_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      page_stickers: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          diary_entry_id: string;
          id: string;
          rotation: number;
          scale: number;
          sticker_id: string;
          updated_at: string;
          user_id: string;
          x: number;
          y: number;
          z: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          diary_entry_id: string;
          id: string;
          rotation?: number;
          scale?: number;
          sticker_id: string;
          updated_at?: string;
          user_id?: string;
          x: number;
          y: number;
          z?: number;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          diary_entry_id?: string;
          id?: string;
          rotation?: number;
          scale?: number;
          sticker_id?: string;
          updated_at?: string;
          user_id?: string;
          x?: number;
          y?: number;
          z?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'page_stickers_diary_entry_id_fkey';
            columns: ['diary_entry_id'];
            isOneToOne: false;
            referencedRelation: 'diary_entries';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          app_lock: string;
          checkin_enabled: boolean;
          checkin_time: string;
          checkin_weekday: number;
          created_at: string;
          currency: string;
          display_name: string | null;
          haptics: boolean;
          id: string;
          onboarded_at: string | null;
          palette: string;
          reduced_motion: boolean;
          sounds: boolean;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          app_lock?: string;
          checkin_enabled?: boolean;
          checkin_time?: string;
          checkin_weekday?: number;
          created_at?: string;
          currency?: string;
          display_name?: string | null;
          haptics?: boolean;
          id: string;
          onboarded_at?: string | null;
          palette?: string;
          reduced_motion?: boolean;
          sounds?: boolean;
          updated_at?: string;
        };
        Update: {
          app_lock?: string;
          checkin_enabled?: boolean;
          checkin_time?: string;
          checkin_weekday?: number;
          created_at?: string;
          currency?: string;
          display_name?: string | null;
          haptics?: boolean;
          id?: string;
          onboarded_at?: string | null;
          palette?: string;
          reduced_motion?: boolean;
          sounds?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      quests: {
        Row: {
          completed_at: string | null;
          day: string;
          quest_id: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          completed_at?: string | null;
          day: string;
          quest_id: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          completed_at?: string | null;
          day?: string;
          quest_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      stars: {
        Row: {
          created_at: string;
          day: string;
          earned_by: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          day: string;
          earned_by: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          day?: string;
          earned_by?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sticker_awards: {
        Row: {
          awarded_at: string;
          deleted_at: string | null;
          id: string;
          source: string;
          source_id: string | null;
          sticker_id: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          awarded_at?: string;
          deleted_at?: string | null;
          id: string;
          source: string;
          source_id?: string | null;
          sticker_id: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          awarded_at?: string;
          deleted_at?: string | null;
          id?: string;
          source?: string;
          source_id?: string | null;
          sticker_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      unlocks: {
        Row: {
          unlock_id: string;
          unlocked_at: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          unlock_id: string;
          unlocked_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          unlock_id?: string;
          unlocked_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_my_account: { Args: Record<PropertyKey, never>; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
