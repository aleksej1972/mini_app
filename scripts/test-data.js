const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testData() {
  console.log('🧪 Testing data retrieval...')
  
  try {
    // Test lessons
    console.log('📚 Fetching lessons...')
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('level, order')
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError.message)
    } else {
      console.log(`✅ Found ${lessons.length} lessons:`)
      lessons.forEach(lesson => {
        console.log(`   - ${lesson.level}: ${lesson.title}`)
      })
    }
    
    // Test exercises
    if (lessons && lessons.length > 0) {
      console.log('\n🎮 Fetching exercises for first lesson...')
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessons[0].id)
        .order('order')
      
      if (exercisesError) {
        console.error('❌ Error fetching exercises:', exercisesError.message)
      } else {
        console.log(`✅ Found ${exercises.length} exercises:`)
        exercises.forEach(exercise => {
          console.log(`   - ${exercise.type}: ${exercise.xp_reward} XP`)
        })
      }
    }
    
    // Test flashcards
    console.log('\n💳 Fetching flashcards...')
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .limit(5)
    
    if (flashcardsError) {
      console.error('❌ Error fetching flashcards:', flashcardsError.message)
    } else {
      console.log(`✅ Found ${flashcards.length} flashcards:`)
      flashcards.forEach(card => {
        console.log(`   - ${card.word_en} = ${card.word_ru}`)
      })
    }
    
    console.log('\n🎉 Data test complete!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testData()
