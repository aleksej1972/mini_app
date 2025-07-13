import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Check if we have valid Supabase configuration
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' &&
                            supabaseAnonKey !== 'placeholder_key' &&
                            !supabaseUrl.includes('placeholder') &&
                            !supabaseAnonKey.includes('placeholder')

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For server-side operations that require elevated permissions
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key'
)

export { isSupabaseConfigured }
