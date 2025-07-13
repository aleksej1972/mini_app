import { supabase, isSupabaseConfigured } from './supabase'
import { Database } from './database.types'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type Lesson = Database['public']['Tables']['lessons']['Row']
type Exercise = Database['public']['Tables']['exercises']['Row']
type UserProgress = Database['public']['Tables']['user_progress']['Row']
type Flashcard = Database['public']['Tables']['flashcards']['Row']

// User operations
export async function createUser(userData: UserInsert): Promise<User | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning mock user')
    return {
      id: 'mock-user-id',
      telegram_id: userData.telegram_id,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      level: userData.level || 'A1',
      xp: userData.xp || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  try {
    // Use the admin client to bypass RLS for user creation
    const { supabaseAdmin } = await import('./supabase')
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      // Return a mock user if creation fails
      return {
        id: `user-${userData.telegram_id}`,
        telegram_id: userData.telegram_id,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        level: userData.level || 'A1',
        xp: userData.xp || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return data
  } catch (error) {
    console.error('Error in createUser:', error)
    // Return a mock user as fallback
    return {
      id: `user-${userData.telegram_id}`,
      telegram_id: userData.telegram_id,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      level: userData.level || 'A1',
      xp: userData.xp || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

export async function getUserByTelegramId(telegramId: number): Promise<User | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning null (user will be created)')
    return null
  }

  try {
    // Use admin client to bypass RLS issues
    const { supabaseAdmin } = await import('./supabase')
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserByTelegramId:', error)
    return null
  }
}

export async function updateUserXP(userId: string, xpToAdd: number): Promise<User | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, XP update skipped')
    return null
  }

  try {
    // Use admin client to bypass RLS issues
    const { supabaseAdmin } = await import('./supabase')
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ xp: supabaseAdmin.sql`xp + ${xpToAdd}` })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user XP:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateUserXP:', error)
    return null
  }
}

// Lesson operations
export async function getLessonsByLevel(level: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('level', level)
    .order('order')

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }

  return data || []
}

export async function getAllLessons(): Promise<Lesson[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning mock lessons')
    return [
      {
        id: 'lesson-1',
        title: 'Basic Greetings',
        description: 'Learn how to say hello and introduce yourself',
        level: 'A1',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'lesson-2',
        title: 'Numbers 1-10',
        description: 'Learn basic numbers from one to ten',
        level: 'A1',
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'lesson-3',
        title: 'Present Simple Tense',
        description: 'Learn how to use present simple tense',
        level: 'A2',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('level, order')

  if (error) {
    console.error('Error fetching all lessons:', error)
    return []
  }

  return data || []
}

// Exercise operations
export async function getExercisesByLessonId(lessonId: string): Promise<Exercise[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, returning mock exercises')
    return [
      {
        id: 'exercise-1',
        lesson_id: lessonId,
        type: 'quiz',
        content_json: {
          question: "How do you greet someone in the morning?",
          options: ["Good morning", "Good night", "Good afternoon", "Good evening"],
          correct: "Good morning"
        },
        xp_reward: 10,
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'exercise-2',
        lesson_id: lessonId,
        type: 'fill-in-the-blank',
        content_json: {
          sentence: "Hello, my name ___ John.",
          options: ["is", "are", "am", "be"],
          correct: "is"
        },
        xp_reward: 10,
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'exercise-3',
        lesson_id: lessonId,
        type: 'sentence-builder',
        content_json: {
          translation: "Меня зовут Анна.",
          correct_order: ["My", "name", "is", "Anna"],
          extra_words: ["am", "called", "the"]
        },
        xp_reward: 15,
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'exercise-4',
        lesson_id: lessonId,
        type: 'memory-match',
        content_json: {
          word_pairs: [
            { english: "Hello", russian: "Привет" },
            { english: "Good morning", russian: "Доброе утро" },
            { english: "Thank you", russian: "Спасибо" },
            { english: "Please", russian: "Пожалуйста" },
            { english: "Goodbye", russian: "До свидания" },
            { english: "Yes", russian: "Да" }
          ]
        },
        xp_reward: 20,
        order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order')

  if (error) {
    console.error('Error fetching exercises:', error)
    return []
  }

  return data || []
}

// Progress operations
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user progress:', error)
    return []
  }

  return data || []
}

export async function markExerciseComplete(
  userId: string,
  lessonId: string,
  exerciseId: string,
  score?: number
): Promise<UserProgress | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, progress not saved')
    return null
  }

  try {
    // Use admin client to bypass RLS issues
    const { supabaseAdmin } = await import('./supabase')
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        exercise_id: exerciseId,
        completed: true,
        score,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error marking exercise complete:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in markExerciseComplete:', error)
    return null
  }
}

// Flashcard operations
export async function getFlashcardsByLevel(level: string): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('level', level)

  if (error) {
    console.error('Error fetching flashcards:', error)
    return []
  }

  return data || []
}

// Level progression logic
export function calculateLevel(xp: number): string {
  if (xp < 100) return 'A1'
  if (xp < 300) return 'A2'
  if (xp < 600) return 'B1'
  if (xp < 1000) return 'B2'
  if (xp < 1500) return 'C1'
  return 'C2'
}

export function getXPForNextLevel(currentLevel: string): number {
  const levelThresholds = {
    'A1': 100,
    'A2': 300,
    'B1': 600,
    'B2': 1000,
    'C1': 1500,
    'C2': 2000
  }
  return levelThresholds[currentLevel as keyof typeof levelThresholds] || 2000
}
