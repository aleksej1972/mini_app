const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMemoryMatchExercises() {
  try {
    console.log('🎮 Adding Memory Match exercises...')
    
    // Get all lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('level, order')
    
    if (lessonsError) {
      throw lessonsError
    }
    
    // Add memory match exercises for each lesson
    for (const lesson of lessons) {
      console.log(`\n📝 Adding memory match exercise for: ${lesson.title}`)
      
      // Check if memory-match exercise already exists
      const { data: existingExercise } = await supabase
        .from('exercises')
        .select('id')
        .eq('lesson_id', lesson.id)
        .eq('type', 'memory-match')
        .single()
      
      if (existingExercise) {
        console.log(`   ✅ Memory match exercise already exists`)
        continue
      }
      
      // Get the highest order number for this lesson
      const { data: maxOrderExercise } = await supabase
        .from('exercises')
        .select('order')
        .eq('lesson_id', lesson.id)
        .order('order', { ascending: false })
        .limit(1)
        .single()
      
      const nextOrder = maxOrderExercise ? maxOrderExercise.order + 1 : 1
      
      // Create memory match exercise based on lesson level
      const exercise = createMemoryMatchExercise(lesson, nextOrder)
      
      const { error: insertError } = await supabase
        .from('exercises')
        .insert(exercise)
      
      if (insertError) {
        console.log(`   ❌ Error: ${insertError.message}`)
      } else {
        console.log(`   ✅ Added memory match exercise`)
      }
    }
    
    console.log('\n🎉 Memory match exercises added successfully!')
    
  } catch (error) {
    console.error('❌ Failed to add memory match exercises:', error.message)
  }
}

function createMemoryMatchExercise(lesson, order) {
  const wordPairsByLevel = {
    'A1': [
      { english: "Hello", russian: "Привет" },
      { english: "Good morning", russian: "Доброе утро" },
      { english: "Thank you", russian: "Спасибо" },
      { english: "Please", russian: "Пожалуйста" },
      { english: "Goodbye", russian: "До свидания" },
      { english: "Yes", russian: "Да" }
    ],
    'A2': [
      { english: "Family", russian: "Семья" },
      { english: "House", russian: "Дом" },
      { english: "School", russian: "Школа" },
      { english: "Friend", russian: "Друг" },
      { english: "Work", russian: "Работа" },
      { english: "Food", russian: "Еда" }
    ],
    'B1': [
      { english: "Experience", russian: "Опыт" },
      { english: "Important", russian: "Важный" },
      { english: "Difficult", russian: "Трудный" },
      { english: "Interesting", russian: "Интересный" },
      { english: "Beautiful", russian: "Красивый" },
      { english: "Successful", russian: "Успешный" }
    ],
    'B2': [
      { english: "Achievement", russian: "Достижение" },
      { english: "Opportunity", russian: "Возможность" },
      { english: "Challenge", russian: "Вызов" },
      { english: "Development", russian: "Развитие" },
      { english: "Environment", russian: "Окружающая среда" },
      { english: "Technology", russian: "Технология" }
    ],
    'C1': [
      { english: "Sophisticated", russian: "Изощренный" },
      { english: "Comprehensive", russian: "Всеобъемлющий" },
      { english: "Substantial", russian: "Существенный" },
      { english: "Inevitable", russian: "Неизбежный" },
      { english: "Phenomenon", russian: "Явление" },
      { english: "Controversy", russian: "Спор" }
    ],
    'C2': [
      { english: "Unprecedented", russian: "Беспрецедентный" },
      { english: "Quintessential", russian: "Типичный" },
      { english: "Ubiquitous", russian: "Повсеместный" },
      { english: "Meticulous", russian: "Дотошный" },
      { english: "Paradigm", russian: "Парадигма" },
      { english: "Nuance", russian: "Нюанс" }
    ]
  }

  const wordPairs = wordPairsByLevel[lesson.level] || wordPairsByLevel['A1']

  return {
    lesson_id: lesson.id,
    type: 'memory-match',
    content_json: {
      word_pairs: wordPairs
    },
    xp_reward: 20,
    order: order
  }
}

// Run the script
addMemoryMatchExercises()
