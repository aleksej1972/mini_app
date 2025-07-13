export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          level: string
          xp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          level?: string
          xp?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          level?: string
          xp?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string | null
          level: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          level: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          level?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          type: string
          content_json: Json
          xp_reward: number
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          type: string
          content_json: Json
          xp_reward?: number
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          type?: string
          content_json?: Json
          xp_reward?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          exercise_id: string | null
          completed: boolean
          score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          exercise_id?: string | null
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          exercise_id?: string | null
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          word_en: string
          word_ru: string
          audio_url: string | null
          image_url: string | null
          level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word_en: string
          word_ru: string
          audio_url?: string | null
          image_url?: string | null
          level: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word_en?: string
          word_ru?: string
          audio_url?: string | null
          image_url?: string | null
          level?: string
          created_at?: string
          updated_at?: string
        }
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
