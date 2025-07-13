const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTables() {
  console.log('🚀 Setting up database tables...')
  
  const tables = [
    {
      name: 'users',
      sql: `CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        xp INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`
    },
    {
      name: 'lessons',
      sql: `CREATE TABLE IF NOT EXISTS lessons (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        "order" INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(level, "order")
      );`
    },
    {
      name: 'exercises',
      sql: `CREATE TABLE IF NOT EXISTS exercises (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('quiz', 'fill-in-the-blank', 'word-puzzle', 'audio-quiz', 'sentence-builder', 'reading', 'dialog', 'speech-practice', 'memory-match')),
        content_json JSONB NOT NULL,
        xp_reward INTEGER DEFAULT 10,
        "order" INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(lesson_id, "order")
      );`
    },
    {
      name: 'user_progress',
      sql: `CREATE TABLE IF NOT EXISTS user_progress (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
        exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, exercise_id)
      );`
    },
    {
      name: 'flashcards',
      sql: `CREATE TABLE IF NOT EXISTS flashcards (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        word_en TEXT NOT NULL,
        word_ru TEXT NOT NULL,
        audio_url TEXT,
        image_url TEXT,
        level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`
    }
  ]

  // Create tables
  for (const table of tables) {
    try {
      console.log(`📋 Creating table: ${table.name}`)
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql })
      
      if (error) {
        console.log(`⚠️  Table ${table.name}: ${error.message}`)
      } else {
        console.log(`✅ Table ${table.name} ready`)
      }
    } catch (error) {
      console.log(`⚠️  Table ${table.name}: ${error.message}`)
    }
  }

  // Create indexes
  console.log('\n📊 Creating indexes...')
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);',
    'CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);',
    'CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);',
    'CREATE INDEX IF NOT EXISTS idx_flashcards_level ON flashcards(level);'
  ]

  for (const indexSql of indexes) {
    try {
      await supabase.rpc('exec_sql', { sql: indexSql })
    } catch (error) {
      // Ignore index errors
    }
  }

  // Enable RLS
  console.log('\n🔒 Setting up Row Level Security...')
  const rlsCommands = [
    'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;'
  ]

  for (const rlsSql of rlsCommands) {
    try {
      await supabase.rpc('exec_sql', { sql: rlsSql })
    } catch (error) {
      // Ignore RLS errors for now
    }
  }

  // Add sample data
  console.log('\n📝 Adding sample data...')
  await addSampleData()

  console.log('\n🎉 Database setup complete!')
}

async function addSampleData() {
  // Check if lessons already exist
  try {
    const { data: existingLessons } = await supabase.from('lessons').select('id').limit(1)
    if (existingLessons && existingLessons.length > 0) {
      console.log('✅ Sample lessons already exist')
      return
    }
  } catch (error) {
    // Continue to add data
  }

  // Add lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .insert([
      { title: 'Basic Greetings', description: 'Learn how to say hello and introduce yourself', level: 'A1', order: 1 },
      { title: 'Numbers 1-10', description: 'Learn basic numbers from one to ten', level: 'A1', order: 2 },
      { title: 'Colors and Shapes', description: 'Learn basic colors and simple shapes', level: 'A1', order: 3 },
      { title: 'Present Simple Tense', description: 'Learn how to use present simple tense', level: 'A2', order: 1 },
      { title: 'Food and Drinks', description: 'Learn vocabulary about food and beverages', level: 'A2', order: 2 },
      { title: 'Past Simple Tense', description: 'Learn how to talk about past events', level: 'B1', order: 1 }
    ])
    .select()

  if (lessonsError) {
    console.log('⚠️  Error adding lessons:', lessonsError.message)
  } else {
    console.log(`✅ Added ${lessons.length} sample lessons`)
    
    // Add sample exercises for first lesson
    if (lessons && lessons.length > 0) {
      const firstLesson = lessons[0]
      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert([
          {
            lesson_id: firstLesson.id,
            type: 'quiz',
            content_json: {
              question: "How do you greet someone in the morning?",
              options: ["Good morning", "Good night", "Good afternoon", "Good evening"],
              correct: "Good morning"
            },
            xp_reward: 10,
            order: 1
          },
          {
            lesson_id: firstLesson.id,
            type: 'fill-in-the-blank',
            content_json: {
              sentence: "Hello, my name ___ John.",
              options: ["is", "are", "am", "be"],
              correct: "is"
            },
            xp_reward: 10,
            order: 2
          }
        ])
      
      if (!exercisesError) {
        console.log('✅ Added sample exercises')
      }
    }
  }

  // Add flashcards
  const { error: flashcardsError } = await supabase
    .from('flashcards')
    .insert([
      { word_en: 'hello', word_ru: 'привет', level: 'A1' },
      { word_en: 'goodbye', word_ru: 'до свидания', level: 'A1' },
      { word_en: 'please', word_ru: 'пожалуйста', level: 'A1' },
      { word_en: 'thank you', word_ru: 'спасибо', level: 'A1' },
      { word_en: 'yes', word_ru: 'да', level: 'A1' },
      { word_en: 'no', word_ru: 'нет', level: 'A1' }
    ])

  if (!flashcardsError) {
    console.log('✅ Added sample flashcards')
  }
}

setupTables()
